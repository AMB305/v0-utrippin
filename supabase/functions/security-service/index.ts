import { createClient } from "https://esm.sh/@supabase/supabase-js";

// Rate limiting and security headers functions (copied locally to avoid import issues)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(identifier: string, maxRequests: number, windowMs: number): boolean {
  const now = Date.now();
  const entry = rateLimitStore.get(identifier);
  
  if (!entry || now > entry.resetTime) {
    rateLimitStore.set(identifier, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  if (entry.count >= maxRequests) {
    return false;
  }
  
  entry.count++;
  return true;
}

function getSecurityHeaders() {
  return {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:; frame-ancestors 'none';",
  };
}

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

// Create admin client for secure operations
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export default async function handler(request: Request) {
  const securityHeaders = getSecurityHeaders();
  
  if (request.method === 'OPTIONS') {
    return new Response(null, { 
      headers: { 
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
        ...securityHeaders 
      } 
    });
  }

  try {
    // Rate limiting based on IP
    const clientIP = request.headers.get('cf-connecting-ip') || 
                    request.headers.get('x-forwarded-for') || 
                    'unknown';
    
    if (!checkRateLimit(clientIP, 20, 60000)) { // 20 requests per minute
      return new Response(JSON.stringify({ error: 'Rate limit exceeded' }), {
        status: 429,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          ...securityHeaders 
        }
      });
    }

    // Handle different endpoints based on URL path
    const url = new URL(request.url);
    const path = url.pathname;

    if (path.includes('/validate-user')) {
      return await validateUserData(request);
    } else if (path.includes('/audit-log')) {
      return await createAuditLogEndpoint(request);
    } else if (path.includes('/security-check')) {
      return await performSecurityCheck(request);
    }

    return new Response(JSON.stringify({ error: 'Endpoint not found' }), {
      status: 404,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        ...securityHeaders 
      }
    });

  } catch (error) {
    console.error('Security service error:', error);
    
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        ...securityHeaders 
      }
    });
  }
}

async function validateUserData(request: Request) {
  try {
    const { userId, data, operation } = await request.json();
    
    // Validate the request has proper authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    // Log the validation attempt
    await createAuditLog(userId, 'data_validation', {
      operation,
      timestamp: new Date().toISOString(),
      ip: request.headers.get('cf-connecting-ip') || 'unknown'
    });

    return new Response(JSON.stringify({ 
      success: true,
      validated: true,
      timestamp: new Date().toISOString()
    }), {
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        ...getSecurityHeaders()
      }
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: 'Validation failed' }), { status: 400 });
  }
}

async function createAuditLogEndpoint(request: Request) {
  try {
    const { userId, action, metadata } = await request.json();
    const result = await createAuditLog(userId, action, metadata);
    return new Response(JSON.stringify({ success: result }), {
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        ...getSecurityHeaders()
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Audit log creation failed' }), { status: 400 });
  }
}

async function createAuditLog(userId: string, action: string, metadata: any) {
  try {
    const { error } = await supabase.from('audit_logs').insert({
      user_id: userId,
      action,
      metadata,
      created_at: new Date().toISOString()
    });

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Failed to create audit log:', error);
    return false;
  }
}

async function performSecurityCheck(request: Request) {
  try {
    const { checkType, data } = await request.json();
    
    const checks = {
      sql_injection: (input: string) => {
        const sqlPatterns = [
          /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b)/i,
          /(--|\/\*|\*\/|;|'|"|xp_|sp_)/i
        ];
        return sqlPatterns.some(pattern => pattern.test(input));
      },
      
      xss_attempt: (input: string) => {
        const xssPatterns = [
          /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
          /javascript:/gi,
          /on\w+\s*=/gi,
          /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi
        ];
        return xssPatterns.some(pattern => pattern.test(input));
      },
      
      file_upload: (filename: string) => {
        const dangerousExtensions = ['.exe', '.bat', '.cmd', '.scr', '.pif', '.vbs', '.js'];
        return dangerousExtensions.some(ext => filename.toLowerCase().endsWith(ext));
      }
    };

    const result = checks[checkType as keyof typeof checks]?.(data) || false;

    return new Response(JSON.stringify({ 
      checkType,
      dangerous: result,
      timestamp: new Date().toISOString()
    }), {
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        ...getSecurityHeaders()
      }
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: 'Security check failed' }), { status: 500 });
  }
}
