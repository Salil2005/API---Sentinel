// src/config/dns.js
import dns from "dns";

// Force Node to use Google's public DNS servers
dns.setServers(["8.8.8.8", "8.8.4.4"]);