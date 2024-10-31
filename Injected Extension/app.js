const site = window.location.hostname;
const path = window.location.pathname;
const sitePath = path.split('/')[1] || "";

const Add_Custom_Style = css => document.head.appendChild(document.createElement("style")).innerHTML = css;

function Create_Custom_Element(tag, attr_tag, attr_name, value) {
    const custom_element = document.createElement(tag);
    custom_element.setAttribute(attr_tag, attr_name);
    custom_element.innerHTML = value;
    document.body.append(custom_element);
}

if (site.includes("webbuilder.localsearch.com.au")) {

    switch (sitePath) {
        case "site":
            linkChecker(); // No need for await if you don't need to wait
            break;

        case "":
            break;

        case "home":
            break;

        default:
            alert("This is an unrecognized path.");
            break;
    }
}

// async function linkChecker() {
//     const links = Array.from(document.querySelectorAll('a[href*="/site/"]'))
//         .filter(link => !link.href.startsWith("tel:") && !link.href.startsWith("mailto:"));

//     const results = [];

//     const fetchPromises = links.map(async (link) => {
//         url = link.href.split('/').pop();
//         let baseUrl = url.split('?')[0];

//         if (!baseUrl) {
//             baseUrl = 'home';
//         }

//         if (link.href.includes('#')) {
//             const hashPart = url.split('#')[1];
//             results.push(`${link.href} - Anchor link detected`);
//             styleBrokenLink(link, `⚓ ${baseUrl}#${hashPart}`, "orange");
//             return;
//         }

//         try {
//             const response = await fetch(link.href);
//             if (response.ok) {
//                 results.push(`${link.href} - Good Link`);
//                 styleBrokenLink(link, `${baseUrl}`, "green");
//             } else {
//                 results.push(`${link.href} - Broken (Status: ${response.status})`);
//                 styleBrokenLink(link, "⛓️‍💥 Broken Link", "red");
//             }
//         } catch (error) {
//             results.push(`${link.href} - Broken (Error: ${error.message})`);
//             styleBrokenLink(link, "⛓️‍💥 Broken Link", "red");
//         }
//     });

//     await Promise.all(fetchPromises);
//     // console.log(results.join('\n'));
// }

async function linkChecker() {
    const links = Array.from(document.querySelectorAll('a[href*="/site/"]'))
        .filter(link => !link.href.startsWith("tel:") && !link.href.startsWith("mailto:"));

    const results = [];
    const batchSize = 10;  // Number of requests per batch
    const delayBetweenBatches = 100;  // Delay between batches in milliseconds

    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    // Function to handle a batch of requests
    async function processBatch(batchLinks) {
        const fetchPromises = batchLinks.map(async (link) => {
            let url = link.href.split('/').pop();
            let baseUrl = url.split('?')[0];

            if (!baseUrl) {
                baseUrl = 'home';
            }

            if (link.href.includes('#')) {
                const hashPart = url.split('#')[1];
                results.push(`${link.href} - Anchor link detected`);
                styleBrokenLink(link, `⚓ ${baseUrl}#${hashPart}`, "orange");
                return;
            }

            try {
                const response = await fetch(link.href);
                if (response.ok) {
                    results.push(`${link.href} - Good Link`);
                    styleBrokenLink(link, `${baseUrl}`, "green");
                } else {
                    results.push(`${link.href} - Broken (Status: ${response.status})`);
                    styleBrokenLink(link, "⛓️‍💥 Broken Link", "red");
                }
            } catch (error) {
                results.push(`${link.href} - Broken (Error: ${error.message})`);
                styleBrokenLink(link, "⛓️‍💥 Broken Link", "red");
            }
        });

        await Promise.all(fetchPromises);
    }

    // Process links in batches
    for (let i = 0; i < links.length; i += batchSize) {
        const batchLinks = links.slice(i, i + batchSize);
        await processBatch(batchLinks);
        await delay(delayBetweenBatches);  // Delay between batches
    }

    // Uncomment to log results to console
    // console.log(results.join('\n'));
}

function styleBrokenLink(link, content, color) {
    const divContainer = document.createElement('div');
    divContainer.textContent = content;
    divContainer.style.color = 'white';
    divContainer.style.backgroundColor = color;
    divContainer.style.borderRadius = '50px';
    divContainer.style.border = 'solid 2px black';
    divContainer.style.padding = '3px 10px';
    divContainer.style.textAlign = 'center';
    divContainer.style.minWidth = '70px';
    divContainer.style.fontSize = '15px';
    divContainer.style.fontWeight = '700';
    divContainer.style.marginTop = '5px';
    divContainer.style.textWrap = 'nowrap';
    // divContainer.style.display = 'unset';
    // divContainer.style.position = 'absolute';
    divContainer.style.zIndex = '2';
    link.appendChild(divContainer);
}