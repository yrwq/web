'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AnalyticsTestPage() {
  const [clickCount, setClickCount] = useState(0);
  const [debugInfo, setDebugInfo] = useState<string[]>([]);

  useEffect(() => {
    // Check if analytics scripts are loaded
    const checkAnalyticsScripts = () => {
      const logs: string[] = [];

      // Check for Vercel Analytics script
      const analyticsScript = document.querySelector('script[src*="_vercel/insights"]');
      if (analyticsScript) {
        logs.push('✅ Vercel Analytics script found');
      } else {
        logs.push('❌ Vercel Analytics script NOT found');
      }

      // Check for Speed Insights script
      const speedInsightsScript = document.querySelector('script[src*="_vercel/speed-insights"]');
      if (speedInsightsScript) {
        logs.push('✅ Speed Insights script found');
      } else {
        logs.push('❌ Speed Insights script NOT found');
      }

      // Check if window.va (Vercel Analytics) is available
      if (typeof window !== 'undefined' && (window as any).va) {
        logs.push('✅ Vercel Analytics (window.va) is available');
      } else {
        logs.push('❌ Vercel Analytics (window.va) is NOT available');
      }

      // Check for Speed Insights vitals
      if (typeof window !== 'undefined' && (window as any).webVitals) {
        logs.push('✅ Web Vitals is available');
      } else {
        logs.push('❌ Web Vitals is NOT available');
      }

      setDebugInfo(logs);
    };

    // Check immediately and after a delay
    checkAnalyticsScripts();
    const timer = setTimeout(checkAnalyticsScripts, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleTestClick = () => {
    setClickCount(prev => prev + 1);

    // Try to send a custom event if analytics is available
    if (typeof window !== 'undefined' && (window as any).va) {
      try {
        (window as any).va('track', 'test-button-click', {
          count: clickCount + 1
        });
        console.log('✅ Analytics event sent successfully');
      } catch (error) {
        console.error('❌ Failed to send analytics event:', error);
      }
    }
  };

  const performHeavyTask = () => {
    // Simulate a performance-heavy task to test Speed Insights
    const start = performance.now();
    let result = 0;
    for (let i = 0; i < 1000000; i++) {
      result += Math.random();
    }
    const end = performance.now();
    console.log(`Heavy task completed in ${end - start} milliseconds`);
    alert(`Task completed in ${(end - start).toFixed(2)}ms`);
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Analytics & Speed Insights Test Page</h1>

        <div className="grid gap-8">
          {/* Debug Information */}
          <div className="bg-card p-6 rounded-lg border">
            <h2 className="text-xl font-semibold mb-4">Debug Information</h2>
            <div className="space-y-2">
              {debugInfo.map((info, index) => (
                <div key={index} className="font-mono text-sm">
                  {info}
                </div>
              ))}
            </div>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
            >
              Refresh Debug Info
            </button>
          </div>

          {/* Analytics Test */}
          <div className="bg-card p-6 rounded-lg border">
            <h2 className="text-xl font-semibold mb-4">Analytics Test</h2>
            <p className="mb-4">Click the button below to test analytics event tracking:</p>
            <button
              onClick={handleTestClick}
              className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 mr-4"
            >
              Test Analytics Click (Count: {clickCount})
            </button>
            <p className="mt-2 text-sm text-muted-foreground">
              Check your browser's Network tab for requests to /_vercel/insights/
            </p>
          </div>

          {/* Speed Insights Test */}
          <div className="bg-card p-6 rounded-lg border">
            <h2 className="text-xl font-semibold mb-4">Speed Insights Test</h2>
            <p className="mb-4">These actions help test Speed Insights metrics:</p>
            <div className="space-x-4">
              <button
                onClick={performHeavyTask}
                className="px-6 py-3 bg-orange-600 text-white rounded hover:bg-orange-700"
              >
                Simulate Heavy Task
              </button>
              <Link
                href="/"
                className="inline-block px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Navigate Away (Tests Page Unload)
              </Link>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Speed Insights data is sent on page unload/blur events. Try navigating away or switching tabs.
            </p>
          </div>

          {/* Network Requests Check */}
          <div className="bg-card p-6 rounded-lg border">
            <h2 className="text-xl font-semibold mb-4">What to Check</h2>
            <div className="space-y-3">
              <div>
                <h3 className="font-semibold">Browser Developer Tools - Network Tab:</h3>
                <ul className="list-disc list-inside space-y-1 text-sm mt-2">
                  <li>Look for requests to <code className="bg-muted px-1 rounded">/_vercel/insights/script.js</code></li>
                  <li>Look for requests to <code className="bg-muted px-1 rounded">/_vercel/speed-insights/script.js</code></li>
                  <li>After clicking buttons, look for POST requests to <code className="bg-muted px-1 rounded">/_vercel/insights/</code></li>
                  <li>After page navigation, look for requests to <code className="bg-muted px-1 rounded">/_vercel/speed-insights/vitals</code></li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold">Browser Console:</h3>
                <ul className="list-disc list-inside space-y-1 text-sm mt-2">
                  <li>With debug mode enabled, you should see analytics logs</li>
                  <li>Check for any error messages related to analytics or speed insights</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <h2 className="text-xl font-semibold mb-4">Troubleshooting Steps</h2>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>Ensure Analytics and Speed Insights are enabled in your Vercel dashboard</li>
              <li>Make sure your site is deployed and promoted to production</li>
              <li>Check that ad blockers aren't interfering with the scripts</li>
              <li>Verify your domain is correctly configured in Vercel</li>
              <li>Wait 24-48 hours for data to appear in the dashboard after first deployment</li>
              <li>Test on your production domain, not localhost</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
