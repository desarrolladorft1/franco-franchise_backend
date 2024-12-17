const PROXY_CONFIG = [
    {
        context: [
            "/HttpsBack"
        ],
        target: "https://localhost:4200",
        secure: false
    }
    ]
      
    
    module.exports = PROXY_CONFIG;