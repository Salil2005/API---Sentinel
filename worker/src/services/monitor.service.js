import axios from "axios";

export const executeMonitorCheck = async (monitor) => {
    const checkedAt = new Date();
    const startTime = Date.now();

    try{
        const response = await axios({
        method: monitor.method,
        url: monitor.url,
        headers: monitor.headers,
        data: monitor.body,
        timeout: monitor.timeoutMs,
        validateStatus: () => true,
        maxRedirects: 0,
        });

        const responseTimeMs = Date.now() - startTime;

        const success =
        response.status === monitor.expectedStatus &&
        (!monitor.latencyThresholdMs ||
            responseTimeMs <= monitor.latencyThresholdMs);

        return {
        monitorId: monitor._id,
        checkedAt,
        success,
        statusCode: response.status,
        responseTimeMs,
        errorType: success ? null : "HTTP_ERROR",
        errorMessage: success
            ? null
            : `Expected status ${monitor.expectedStatus}, received ${response.status}`,
        bodyValidationPassed: null,
        };        
    }
    catch(error){
        const responseTimeMs = Date.now() - startTime;

        let errorType = "REQUEST_ERROR";

        if(error.code == "ECONNABORTED"){
            errorType = "TIMEOUT" ;
        }
        else if (error.code === "ENOTFOUND") {
            errorType = "DNS_ERROR";
        } 
        else if (error.code === "ECONNREFUSED") {
            errorType = "CONNECTION_REFUSED";
        }

         return {
            monitorId: monitor._id,
            checkedAt,
            success: false,
            statusCode: error.response?.status ?? null,
            responseTimeMs,
            errorType,
            errorMessage: error.message.slice(0, 500),
            bodyValidationPassed: null,
        };
    }
};