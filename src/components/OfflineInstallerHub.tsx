import React, { useState, useEffect } from "react";
import { Download, Share2, Clipboard, Check, Smartphone, Laptop, AlertCircle, Sparkles, ServerCrash, X, HelpCircle, HardDrive } from "lucide-react";
import { toast } from "react-hot-toast";

interface OfflineInstallerHubProps {
  isOpen: boolean;
  onClose: () => void;
  triggerInstall: () => Promise<void>;
  hasPromptEvent: boolean;
}

export function OfflineInstallerHub({ isOpen, onClose, triggerInstall, hasPromptEvent }: OfflineInstallerHubProps) {
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [customIp, setCustomIp] = useState("192.168.1.1");
  const [copiedCommand, setCopiedCommand] = useState(false);

  useEffect(() => {
    // Generate a simulated local IP or grab from window if available
    const possibleIps = ["192.168.1.102", "192.168.8.4", "192.168.0.12", "10.0.0.8"];
    const randomIp = possibleIps[Math.floor(Math.random() * possibleIps.length)];
    setCustomIp(randomIp);
  }, []);

  if (!isOpen) return null;

  const appUrl = "https://food-net-opal.vercel.app/";

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(appUrl);
      setCopied(true);
      toast.success("FoodNet universal setup link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy setup link");
    }
  };

  const handleCopyCommand = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCommand(true);
      toast.success("Command copied! Ready to launch offline installer.");
      setTimeout(() => setCopiedCommand(false), 2000);
    } catch (err) {
      toast.error("Failed to copy command");
    }
  };

  const handleDownloadZip = () => {
    setIsDownloading(true);
    toast.loading("Preparing offline setup package bundle...", { id: "pwa-zip" });
    
    setTimeout(() => {
      // Create link and click
      const a = document.createElement("a");
      a.href = "/foodnet-portable-setup.zip";
      a.download = "foodnet-portable-setup.zip";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      toast.success("Portable offline zip setup file downloaded!", { id: "pwa-zip" });
      setIsDownloading(false);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" id="portable-installer-modal">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md" onClick={onClose} />

      {/* Modal Container */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl border-4 border-orange-500 overflow-hidden transform transition-all duration-300">
          
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-8 text-white relative">
            <button 
              onClick={onClose} 
              className="absolute top-6 right-6 p-2 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors cursor-pointer"
              title="Close Panel"
            >
              <X size={20} />
            </button>
            <div className="flex items-center gap-3.5 mb-2.5">
              <div className="p-2.5 bg-white/10 rounded-2xl">
                <HardDrive size={28} className="animate-pulse" />
              </div>
              <span className="text-[10px] font-black tracking-[0.25em] bg-white/20 px-3 py-1 rounded-full uppercase">
                Portable App Engine
              </span>
            </div>
            <h2 className="text-3xl font-black tracking-tight leading-none">
              Offline Setup & Portability Center
            </h2>
            <p className="text-xs text-orange-50 font-semibold mt-2.5 max-w-lg">
              Install FoodNet instantly on any computer, mobile device, or TV. Transfer, copy, and set up your app even without an active internet connection.
            </p>
          </div>

          {/* Modal Content */}
          <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">

            {/* Quick Setup Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              {/* Option 1: Native Installation */}
              <div className="bg-orange-50/50 border-2 border-orange-100 rounded-3xl p-6 flex flex-col justify-between hover:border-orange-200 transition-all">
                <div>
                  <div className="flex items-center gap-2 text-orange-700 font-extrabold text-sm uppercase mb-2">
                    <Smartphone size={18} />
                    Native Fast Install
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed font-semibold">
                    Install right now as a lightweight standalone app with offline support on your current screen.
                  </p>
                </div>
                <div className="mt-5">
                  <button
                    onClick={async () => {
                      // Immediately initiate the portable installer ZIP download
                      handleDownloadZip();
                      
                      // Attempt native PWA installation if supported by the browser
                      if (hasPromptEvent) {
                        try {
                          await triggerInstall();
                        } catch (pwaErr) {
                          console.log("PWA prompt interaction", pwaErr);
                        }
                      }
                      onClose();
                    }}
                    className="w-full py-3 bg-orange-600 hover:bg-orange-750 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all cursor-pointer shadow-lg shadow-orange-600/10 animate-bounce"
                  >
                    Install Now
                  </button>
                </div>
              </div>

              {/* Option 2: Copy & Transfer Installer */}
              <div className="bg-slate-50 border-2 border-slate-100 rounded-3xl p-6 flex flex-col justify-between hover:border-indigo-100 transition-all">
                <div>
                  <div className="flex items-center gap-2 text-slate-700 font-extrabold text-sm uppercase mb-2">
                    <Laptop size={18} />
                    Copy Offline Zip Setup
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed font-semibold">
                    Download the compiled offline static bundle. Send this setup folder to another offline device via usb, memory card, or bluetooth to launch!
                  </p>
                </div>
                <div className="mt-5">
                  <button
                    onClick={handleDownloadZip}
                    disabled={isDownloading}
                    className="w-full py-3 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Download size={14} />
                    {isDownloading ? "Bundling Setup..." : "Download Setup ZIP"}
                  </button>
                </div>
              </div>

            </div>

            {/* Instruction Steps for Offline Installer */}
            <div className="bg-slate-50 border-1 border-slate-200/60 rounded-3xl p-6 space-y-4">
              <div className="flex items-center gap-2">
                <Laptop size={16} className="text-slate-500" />
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-700">
                  How To Instantly Create "FoodNet.exe" App Offline
                </h3>
              </div>
              <ol className="text-xs text-gray-500 font-bold space-y-3 list-decimal list-inside pl-1 leading-relaxed">
                <li>
                  Click <span className="text-slate-850 font-extrabold text-[11px] underline">Download Setup ZIP</span> to bundle and save <b className="text-slate-900 font-bold">foodnet-portable-setup.zip</b>.
                </li>
                <li>
                  Transfer or copy the ZIP file to any Windows computer or offline device.
                </li>
                <li>
                  Extract/Unzip the contents to a folder of your choice.
                </li>
                <li>
                  Double-click <b className="text-orange-600">Install-FoodNet.bat</b> inside the extracted folder.
                </li>
                <li>
                  Our installer automatically registers FoodNet into your Windows Control Panel (Add or Remove Programs) and adds a branded <b className="text-orange-600 font-bold">FoodNet Shortcut</b> with official app icons onto your Desktop that opens it in standalone application mode.
                </li>
              </ol>
            </div>

            {/* Local Server Sharing Hub */}
            <div className="border border-orange-100 rounded-3xl p-6 bg-amber-50/20 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Share2 size={16} className="text-orange-500" />
                  <h3 className="text-xs font-black uppercase tracking-wider text-orange-850">
                    Host Local Network Server
                  </h3>
                </div>
                <span className="text-[9px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full uppercase">
                  Local WLAN
                </span>
              </div>
              <p className="text-xs text-slate-600 font-semibold leading-relaxed">
                If the device is on the same local Wi-Fi or hotspot network, host from your PC by running a simple server in the setup folder and let other devices connect instantly.
              </p>
              
              <div className="bg-slate-900 text-slate-100 rounded-2xl p-4 font-mono text-[11px] space-y-2 relative group overflow-x-auto">
                <div className="text-slate-400 text-[10px] uppercase font-bold tracking-widest mb-1 select-none">
                  Run inside extracted setup folder:
                </div>
                <code>npx serve -s . -l 3000</code>
                <button
                  type="button"
                  onClick={() => handleCopyCommand("npx serve -s . -l 3000")}
                  className="absolute top-3 right-3 p-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
                  title="Copy command"
                >
                  {copiedCommand ? <Check size={14} className="text-emerald-500" /> : <Clipboard size={14} />}
                </button>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="flex-1">
                  <span className="text-[10px] uppercase text-gray-500 font-extrabold block mb-1">
                    Universal Live URL / Setup Share:
                  </span>
                  <div className="bg-white border rounded-xl py-2 px-3 text-xs font-bold text-slate-700 font-sans flex items-center justify-between shadow-sm overflow-hidden truncate">
                    {appUrl}
                  </div>
                </div>
                <button
                  onClick={handleCopyLink}
                  type="button"
                  className="px-4 py-2 bg-orange-100 hover:bg-orange-200 text-orange-700 font-black text-[10px] uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer border border-orange-200"
                >
                  {copied ? <Check size={12} /> : <Clipboard size={12} />}
                  Copy Link
                </button>
              </div>
            </div>

            {/* Offline Health Status */}
            <div className="bg-slate-100 rounded-3xl p-4 flex items-center gap-3 text-slate-600 font-semibold">
              <AlertCircle size={16} className="text-slate-500 shrink-0" />
              <div className="text-[11px] leading-snug">
                Once downloaded, FoodNet stores core features, menus, the interactive client basket, and language settings cache offline forever. Active kitchen live streams require internet data.
              </div>
            </div>

          </div>

          {/* Modal Footer */}
          <div className="bg-slate-50 border-t border-slate-100 py-5 px-8 flex items-center justify-between">
            <span className="text-[10px] font-black tracking-wider text-slate-400 uppercase flex items-center gap-1">
              <Sparkles size={12} className="text-amber-500" />
              Offline Portability Studio v1.1
            </span>
            <button
              onClick={onClose}
              className="px-5 py-2.5 bg-white border font-black text-xs uppercase tracking-widest text-slate-700 hover:bg-slate-50 rounded-xl transition-all cursor-pointer"
            >
              Close Hub
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
