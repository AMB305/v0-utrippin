// Enhanced Analytics tracking for SEO metrics
export class SEOAnalytics {
  private static gtag = (window as any).gtag;

  // Track search queries for SEO insights
  static trackSearch(query: string, category: 'flights' | 'hotels' | 'cars' | 'packages') {
    if (this.gtag) {
      this.gtag('event', 'search', {
        search_term: query,
        category: category,
        custom_parameters: {
          seo_category: category,
          search_source: 'organic'
        }
      });
    }
  }

  // Track blog post engagement
  static trackBlogEngagement(postTitle: string, action: 'view' | 'read_complete' | 'share') {
    if (this.gtag) {
      this.gtag('event', `blog_${action}`, {
        blog_title: postTitle,
        content_category: 'blog',
        engagement_type: action
      });
    }
  }

  // Track conversion funnel for SEO attribution
  static trackConversionStep(step: 'search_start' | 'results_view' | 'booking_start' | 'booking_complete', category: string) {
    if (this.gtag) {
      this.gtag('event', 'conversion_step', {
        step_name: step,
        service_category: category,
        traffic_source: 'organic'
      });
    }
  }

  // Track page performance metrics for Core Web Vitals
  static trackPagePerformance(pageName: string, metrics: {
    lcp?: number;
    fid?: number;
    cls?: number;
    ttfb?: number;
  }) {
    if (this.gtag) {
      this.gtag('event', 'page_performance', {
        page_name: pageName,
        ...metrics,
        custom_parameters: {
          seo_page_type: pageName
        }
      });
    }
  }

  // Track internal link clicks for SEO insights
  static trackInternalLink(fromPage: string, toPage: string, linkText: string) {
    if (this.gtag) {
      this.gtag('event', 'internal_link_click', {
        from_page: fromPage,
        to_page: toPage,
        link_text: linkText,
        link_type: 'internal_seo'
      });
    }
  }

  // Track external link clicks
  static trackExternalLink(url: string, context: string) {
    if (this.gtag) {
      this.gtag('event', 'external_link_click', {
        external_url: url,
        link_context: context
      });
    }
  }

  // Track scroll depth for content engagement
  static trackScrollDepth(page: string, depth: 25 | 50 | 75 | 100) {
    if (this.gtag) {
      this.gtag('event', 'scroll_depth', {
        page_name: page,
        scroll_depth: depth,
        engagement_metric: true
      });
    }
  }
}