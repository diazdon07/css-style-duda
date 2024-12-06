const elementsToCheck = document.querySelectorAll('.dmNewParagraph, .dmHoursOfOperation, .dmform, .moduleScroll, .modulesFlex, a, h1, h2, h3, h4, h5, h6');

    function logToWindow(message) {
        const logsDiv = window.open('', 'LogWindow', 'width=400,height=600').document.getElementById('logs');
        logsDiv.innerHTML += `${message}<br>`;
    }
    
    function checkValidElements(elementsToCheck) {
        const errors = [];
        let h1Count = 0;
        let h2Count = 0;
    
        elementsToCheck.forEach(element => {
            let connectedToData = element.getAttribute("data-binding");
            let innerRow = element.querySelectorAll(".dmRespRow");
            let spanElement = element.querySelectorAll("span");
            let respCol = element.querySelectorAll(".dmRespCol");
            const tagType = element.tagName.toLowerCase();
            const linkTarget = element.getAttribute('target');
    
            switch (true) {
                // Case for Text Contact link setup
                case element.classList.contains("dmNewParagraph"): {
                    const paragraphs = element.querySelectorAll('p');
                    paragraphs.forEach(paragraph => {
                        const link = paragraph.querySelector('a[href^="tel:"]');
                        const span = paragraph.querySelector('span[data-inline-binding*="content_library.global.phone"]');
                        const mobileRegex = /^04\d{2} \d{3} \d{3}$/;
                        const landlineRegex = /^(02|03|07) \d{4} \d{4}$/;
    
                        if (link && span) {
                            const phoneNumber = link.getAttribute('href').replace('tel:', '').trim();
                            const spanText = span.textContent.trim();
                            if (spanText !== phoneNumber) {
                                link.style.cssText = 'border: 2px solid red;';
                                span.textContent += ' [Wrong Setup]';
                                errors.push({ type: 'Phone mismatch', message: 'Phone number does not match span content' });
                            } else if (!mobileRegex.test(phoneNumber) && !landlineRegex.test(phoneNumber)) {
                                link.style.cssText = 'border: 2px solid orange;';
                                span.textContent += ' [Invalid Phone Format]';
                                errors.push({ type: 'Phone format error', message: 'Phone number format is incorrect' });
                            }
                        } else if (link) {
                            link.style.cssText = 'border: 2px solid red;';
                            link.textContent += ' [Not Connected To Data]';
                            errors.push({ type: 'Link error', message: 'Link not connected to data' });
                        } else if (span) {
                            span.style.cssText = 'border: 2px solid red;';
                            span.textContent += ' [Not Linked]';
                            errors.push({ type: 'Span error', message: 'Span not linked' });
                        }
                    });
                    break;
                }
    
                // Case for Business Hours
                case element.classList.contains("dmHoursOfOperation"): {
                    if (!connectedToData) {
                        element.style.cssText = 'border: 2px solid red;';
                        errors.push({ type: 'Business Hours error', message: 'Hours of operation not connected to data' });
                    }
                    break;
                }
    
                // Case for Contact Form
                case element.classList.contains("dmform"): {
                    const autoReplayName = element.querySelector('input[name="dmformautoreplyenabled"]');

                    if (!connectedToData) {
                        element.style.cssText = 'border: 2px solid red !important;';
                        errors.push({ type: 'Contact Form error', message: 'Contact Form not connected to data' });
                    }
                    if (autoReplayName.value === "true") {
                        element.style.cssText = 'border: 2px solid blue !important;';
                        errors.push({ type: 'Contact Form error', message: 'Contact Form Enable Auto Reply' });
                    }else{
                    }
    
                    const displaySuccessMessage = element.querySelector(`div[class="dmform-success"]`);
                    displaySuccessMessage.style.cssText = 'padding: 20px; display: block; border: solid 1px;'
    
                    const displayErrorMessage = element.querySelector(`div[class="dmform-error"]`);
                    displayErrorMessage.style.cssText = 'padding: 20px; margin-top: 20px; display: block; border: solid 1px;'
                    break;
                }
    
                // Case for Heading tags (h1, h2, etc.)
                case ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tagType): {
                    const span = document.createElement('span');
                    span.textContent += ` [${tagType}]`;
    
                    if (tagType === 'h1') h1Count++;
                    if (tagType === 'h2') {
                        h2Count++;
                        const textWithoutAmpersand = element.textContent.replace(/&/g, '').trim();
                        const wordCount = textWithoutAmpersand.split(/\s+/).length;
                        if (spanElement.length === 1){
                            if (wordCount < 2) {
                                errors.push({ type: 'h2 word count', message: `h2 content more than 2 word (excluding "&")` });
                            }
                        } else if (spanElement.length >= 2) {
                            const spanTexts = Array.from(element).map(span => span.textContent.replace(/&/g, '').trim());
                            const combinedText = spanTexts.join(' ');
                            const combinedWordCount = combinedText.split(/\s+/).length;
    
                            if (combinedWordCount < 2) {
                                errors.push({ type: 'h2 word count', message: 'h2 combined content must contain more than 2 words (excluding "&")' });
                            }
                        }
    
                        if (h2Count > 4) {
                            errors.push({ type: 'h2 limit', message: 'Exceeded h2 tag limit' });
                        }
                    }
    
                    switch (tagType) {
                        case 'h1': element.style.backgroundColor = '#FFC0CB'; break;
                        case 'h2': element.style.backgroundColor = '#FFA500'; break;
                        case 'h3': element.style.backgroundColor = '#FFFF00'; break;
                        case 'h4': element.style.backgroundColor = '#7FFFD4'; break;
                        case 'h5': element.style.backgroundColor = '#F79B82'; break;
                        case 'h6': element.style.backgroundColor = '#DDA0DD'; break;
                    }
    
                    element.appendChild(span);
                    break;
                }
    
                // Module Scroll Checking
                case element.classList.contains("moduleScroll"): {
                                
                    if (innerRow.length === 1){
                        const visibleCols = Array.from(respCol).filter(col => !col.classList.contains('hide-for-small'));
    
                        if (visibleCols.length <= 3){
                            element.style.cssText = 'border: solid red;';
                            errors.push({ type: 'Module Scroll Error', message: 'Please Remove Module Scrolling.' });
                        }
    
                        const tagName = element.tagName.toLowerCase();
                        if (tagName === 'a'){
                            tagName.style.cssText = 'border: solid 5px red;';
                        }
                    }
                    break;
                }
    
                // Other cases remain as before
                case element.tagName.toLowerCase() === 'a': {
                    
                    if (linkTarget === "_blank") {
                        element.style.cssText = 'border: dashed 5px red;';
                        console.log(`Please check if this link has target="_blank".`);
                    }
                    break;
                }
    
                case element.classList.contains("moduleScroll"): {
    
                }
            }
        });
    
        if (errors.length === 0) {
            alert("All elements validated successfully.");
        } else {
            window.open('', 'LogWindow', 'width=400,height=600').document.write(`<div id="logs"></div>`);
            logToWindow("<h1>Errors To Check</h1>");
            errors.forEach((error, index) => {
                logToWindow(`<input type="checkbox" id="error-${index}" name="error-${index}">
                             <label for="error-${index}">${error.message}</label>`);
            });
            console.log("Errors found:", errors);
        }
    }
    
    checkValidElements(elementsToCheck);