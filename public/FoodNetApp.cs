using System;
using System.IO;
using System.Net;
using System.Diagnostics;
using System.Threading;

public class FoodNetApp {
    private static HttpListener listener;
    private static int port;
    private static string baseDir;
    private static bool running = true;

    [STAThread]
    public static void Main() {
        baseDir = AppDomain.CurrentDomain.BaseDirectory;
        
        // Find an empty, high-performance port dynamically
        port = FindFreePort(29990, 30100);
        
        // Start the background static files HTTP server
        StartServer();

        // Launch Chromium Edge/Chrome in secure Web App mode and track window lifestyle
        LaunchAndTrackBrowser();

        // Clean closure on exit
        running = false;
        if (listener != null && listener.IsListening) {
            try {
                listener.Stop();
            } catch {}
        }
    }

    private static int FindFreePort(int start, int end) {
        for (int p = start; p <= end; p++) {
            HttpListener test = new HttpListener();
            try {
                test.Prefixes.Add("http://localhost:" + p + "/");
                test.Start();
                test.Stop();
                test.Close();
                return p;
            } catch {
                try {
                    test.Close();
                } catch {}
            }
        }
        return 29990; // Fallback default port
    }

    private static void StartServer() {
        try {
            listener = new HttpListener();
            listener.Prefixes.Add("http://localhost:" + port + "/");
            listener.Prefixes.Add("http://127.0.0.1:" + port + "/");
            listener.Start();

            Thread serverThread = new Thread(ListenLoop);
            serverThread.IsBackground = true;
            serverThread.Start();
        } catch {
            // SILENT ERROR RESILIENCE
        }
    }

    private static void ListenLoop() {
        while (running && listener != null && listener.IsListening) {
            try {
                HttpListenerContext context = listener.GetContext();
                ThreadPool.QueueUserWorkItem((o) => HandleRequest(context));
            } catch {
                // Break or loop safety
            }
        }
    }

    private static void HandleRequest(HttpListenerContext context) {
        HttpListenerRequest request = context.Request;
        HttpListenerResponse response = context.Response;

        try {
            string rawPath = request.Url.LocalPath.TrimStart('/');
            if (string.IsNullOrEmpty(rawPath)) {
                rawPath = "index.html";
            }

            // Path Traversal Security Block
            if (rawPath.Contains("..")) {
                response.StatusCode = (int)HttpStatusCode.Forbidden;
                response.Close();
                return;
            }

            string filePath = Path.Combine(baseDir, rawPath.Replace('/', Path.DirectorySeparatorChar));
            
            // SPA Routing Support: Serve main index.html for virtual routes in React Router
            if (!File.Exists(filePath)) {
                string ext = Path.GetExtension(filePath).ToLower();
                // If it is a real file request (asset) that is physically missing, serve 404
                if (ext == ".js" || ext == ".css" || ext == ".png" || ext == ".jpg" || ext == ".ico" || ext == ".svg") {
                    response.StatusCode = (int)HttpStatusCode.NotFound;
                    response.Close();
                    return;
                }
                // Otherwise fall back to index.html to allow React Router to render the specific view (e.g. /cart, /orders, /admin)
                filePath = Path.Combine(baseDir, "index.html");
            }

            if (!File.Exists(filePath)) {
                response.StatusCode = (int)HttpStatusCode.NotFound;
                response.Close();
                return;
            }

            byte[] buffer = File.ReadAllBytes(filePath);
            string contentType = GetMimeType(Path.GetExtension(filePath));

            response.ContentType = contentType;
            response.ContentLength64 = buffer.Length;
            
            // Clear cache headers to allow instant offline interface state synchronization during updates
            response.AddHeader("Cache-Control", "no-cache, no-store, must-revalidate");
            response.AddHeader("Pragma", "no-cache");
            response.AddHeader("Expires", "0");

            response.OutputStream.Write(buffer, 0, buffer.Length);
            response.OutputStream.Close();
        } catch {
            try {
                response.StatusCode = (int)HttpStatusCode.InternalServerError;
                response.Close();
            } catch {}
        }
    }

    private static string GetMimeType(string extension) {
        if (extension == null) return "application/octet-stream";
        switch (extension.ToLower()) {
            case ".html": case ".htm": return "text/html; charset=utf-8";
            case ".css": return "text/css; charset=utf-8";
            case ".js": return "application/javascript; charset=utf-8";
            case ".json": return "application/json; charset=utf-8";
            case ".png": return "image/png";
            case ".jpg": case ".jpeg": return "image/jpeg";
            case ".gif": return "image/gif";
            case ".svg": return "image/svg+xml";
            case ".ico": return "image/x-icon";
            case ".xml": return "application/xml; charset=utf-8";
            case ".txt": return "text/plain; charset=utf-8";
            case ".woff": return "font/woff";
            case ".woff2": return "font/woff2";
            case ".ttf": return "font/ttf";
            default: return "application/octet-stream";
        }
    }

    private static void LaunchAndTrackBrowser() {
        string browserPath = FindBrowser();
        string url = "http://localhost:" + port + "/";
        string userData = Path.Combine(baseDir, "User_Data");

        if (!Directory.Exists(userData)) {
            try { Directory.CreateDirectory(userData); } catch {}
        }

        if (string.IsNullOrEmpty(browserPath)) {
            try {
                Process.Start(url);
                while (running) { Thread.Sleep(500); }
            } catch {
                // Ignore
            }
            return;
        }

        // Custom sandbox args to open MS Edge or Chrome in chromeless App mode with custom user data directory
        // This ensures fully isolated sessions, local cookies, fast loading, and brand integration!
        string arguments = "--app=\"" + url + "\" --user-data-dir=\"" + userData + "\" --no-first-run --no-default-browser-check --disable-sync";
        
        ProcessStartInfo psi = new ProcessStartInfo();
        psi.FileName = browserPath;
        psi.Arguments = arguments;
        psi.WindowStyle = ProcessWindowStyle.Normal;

        try {
            using (Process p = Process.Start(psi)) {
                if (p != null) {
                    p.WaitForExit();
                } else {
                    while (running) { Thread.Sleep(500); }
                }
            }
        } catch {
            while (running) { Thread.Sleep(500); }
        }
    }

    private static string FindBrowser() {
        // Preference 1: Microsoft Edge (installed on 100% of modern Windows PCs)
        string[] edgePaths = new string[] {
            @"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
            @"C:\Program Files\Microsoft\Edge\Application\msedge.exe"
        };
        foreach (var path in edgePaths) {
            if (File.Exists(path)) return path;
        }

        // Preference 2: Google Chrome (highly reliable backup player)
        string[] chromePaths = new string[] {
            @"C:\Program Files\Google\Chrome\Application\chrome.exe",
            @"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
            Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), @"Google\Chrome\Application\chrome.exe")
        };
        foreach (var path in chromePaths) {
            if (File.Exists(path)) return path;
        }

        return null;
    }
}
