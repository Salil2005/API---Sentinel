import dns from "node:dns/promises";
import net from "node:net";

const PRIVATE_IPV4_RANGES = [
    /^10\./,
    /^127\./,
    /^169\.254\./,
    /^172\.(1[6-9]|2\d|3[0-1])\./,
    /^192\.168\./,
];

const isPrivateIpv4 = (ip) =>
    PRIVATE_IPV4_RANGES.some((range) => range.test(ip));

const isPrivateIpv6 = (ip) => {
    const normalized = ip.toLowerCase();

    return (
        normalized === "::1" ||
        normalized.startsWith("fc") ||
        normalized.startsWith("fd") ||
        normalized.startsWith("fe80:")
    );
};

const createSsrfError = (message) => {
    const error = new Error(message);
    error.code = "SSRF_BLOCKED";
    return error;
};

export const validateMonitorUrl = async (url) => {
    let parsedUrl;

    try {
        parsedUrl = new URL(url);
    } catch {
        throw createSsrfError("Invalid monitor URL");
    }

    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
        throw createSsrfError(
            "Only HTTP and HTTPS URLs are allowed"
        );
    }

    const hostname = parsedUrl.hostname.toLowerCase();

    if (
        hostname === "localhost" ||
        hostname === "metadata.google.internal" ||
        hostname === "metadata.google" ||
        hostname.endsWith(".internal")
    ) {
        throw createSsrfError(
            "Internal hostnames are not allowed"
        );
    }

    if (net.isIP(hostname)) {
        if (
            isPrivateIpv4(hostname) ||
            isPrivateIpv6(hostname)
        ) {
            throw createSsrfError(
                "Private IP addresses are not allowed"
            );
        }

        return true;
    }

    let addresses;

    try {
        addresses = await dns.lookup(hostname, {
            all: true,
        });
    } catch {
        throw new Error("DNS lookup failed");
    }

    for (const { address } of addresses) {
        if (
            (net.isIPv4(address) && isPrivateIpv4(address)) ||
            (net.isIPv6(address) && isPrivateIpv6(address))
        ) {
            throw createSsrfError(
                "URL resolves to a private IP address"
            );
        }
    }

    return true;
};