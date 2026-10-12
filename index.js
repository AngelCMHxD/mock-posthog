const http = require('http');

const PORT = Number(process.env.PORT) || 3005;

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  let body = '';
  req.on('data', chunk => body += chunk);
  req.on('end', () => {
    if (req.url.includes('/api/early_access_features')) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        earlyAccessFeatures: [
          {
            flagKey: "notifications",
            name: "Notifications",
            description: "Alerts and notifications",
            stage: "beta",
            documentationUrl: ""
          },
          {
            flagKey: "tailscale-integration",
            name: "Tailscale integration",
            description: "Connect your apps to your Tailscale network",
            stage: "beta",
            documentationUrl: ""
          }
        ]
      }));
      return;
    }

    if (req.url.includes('/decide') || req.url.includes('/flags')) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        featureFlags: {
          "notifications": true,
          "tailscale-integration": true
        },
        featureFlagPayloads: {
          "notifications": "true",
          "tailscale-integration": "true"
        },
        errorsLoadingFeatureFlags: false
      }));
      return;
    }

    if (req.url.includes('/capture') || req.url.includes('/batch')) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 1, ignored: true }));
      return;
    }

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true }));
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Mock posthog @ ${PORT}`);
});
