// Environment configuration
export const config = {
  // Detect which environment we're in
  isProduction: typeof window !== 'undefined' && window.location.hostname === 'compucore.itcarlow.ie',
  isLocal: typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'),
  
  // Push server URLs
  pushServer: {
    // For SETU production server
    production: 'https://compucore.itcarlow.ie:3000',
    // For local development
    local: 'http://localhost:3000',
    // For other deployments (Vercel, etc.)
    default: 'http://localhost:3000'
  },
  
  // Get the appropriate push server URL
  getPushServerUrl() {
    if (typeof window === 'undefined') return this.pushServer.local;
    
    const hostname = window.location.hostname;
    
    // SETU production server
    if (hostname === 'compucore.itcarlow.ie') {
      return this.pushServer.production;
    }
    
    // Local development
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return this.pushServer.local;
    }
    
    // Other (Vercel, etc.) - use default
    return this.pushServer.default;
  }
};
