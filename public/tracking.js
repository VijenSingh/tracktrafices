(async () => {
    
    let dynamicUrl = '';

    try {
        const response = await fetch('https://www.tracktraffics.com/getTrackingUrl');
        const data = await response.json();
        dynamicUrl = data.trackingUrl; 
        console.log("dynamicUrl 9=> ",dynamicUrl)
    } catch (error) {
        console.error('Error fetching tracking URL:', error);
        return; 
    }

    let trackingUrl = new URL(dynamicUrl);


    let offerId = trackingUrl.searchParams.get("offer_id");
    let affId = trackingUrl.searchParams.get("aff_id");

    console.log(`Offer ID: ${offerId}, Affiliate ID: ${affId}`);

    let currentUrl = window.location.href;
    let referrer = document.referrer;

  
    const cookieName = "__rock_fingerprint";
    const expirationDate = new Date(Date.now() + 2592e6).toUTCString();
    let guestFingerprint = getCookie(cookieName);
    
    if (!guestFingerprint) {
        guestFingerprint = generateUUID();
        document.cookie = `${cookieName}=${guestFingerprint}; expires=${expirationDate}; path=/`;
    }

    let trackingData = {
        url: currentUrl,
        referrer: referrer,
        uuid: guestFingerprint,
        offerId: offerId,
        affId: affId,
        origin: window.location.hostname,
    };

   
    let backendUrl = "https://www.tracktraffics.com/aff_retag"; 
    fetch(backendUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(trackingData)
    })
    .then(response => response.json())
    .then(data => {
        console.log("data 56 => ",data)
        if (data.error === "success") {
          
            console.log("Tracking data sent successfully", data);
            if (data.data) {
                var tempDiv = document.createElement("div");
                tempDiv.innerHTML = data.data;

                var scripts = tempDiv.querySelectorAll("script");
                if (scripts) {
                    for (const script of scripts) {
                        if (script.src) {
                            var newScript = document.createElement("script");
                            newScript.src = script.src;
                            script.id && (newScript.id = script.id);
                            script.async && (newScript.async = script.async);
                            script.defer && (newScript.defer = script.defer);
                            document.head.appendChild(newScript);
                        } else {
                            var inlineScript = document.createElement("script");
                            inlineScript.textContent = script.textContent;
                            script.type && (inlineScript.type = script.type);
                            document.head.appendChild(inlineScript);
                        }
                    }
                }
            }
        } else {
            console.error("Error in tracking response:", data);
        }
    })
    .catch(err => console.error("Fetch error:", err));
})();

function getCookie(name) {
    const cookieArr = document.cookie.split(";");
    for (let i = 0; i < cookieArr.length; i++) {
        let cookiePair = cookieArr[i].split("=");
        if (name === cookiePair[0].trim()) {
            return decodeURIComponent(cookiePair[1]);
        }
    }
    return null;
}

function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        let r = Math.random() * 16 | 0,
            v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
