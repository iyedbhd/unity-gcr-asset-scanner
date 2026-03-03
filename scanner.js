// Unity Asset Removal Scanner - Main JavaScript

// State
let userAssets = [];
let matchedAssets = [];
let wishlistAssets = [];
let matchedWishlist = [];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    setupFileUpload();
});

// Copy export script to clipboard (minified version for easy pasting)
function copyScript() {
    // Minified script for copying - the readable version is shown in the HTML
    const minified = `(async function(){const e="https://assetstore.unity.com/api/graphql/batch",c=(()=>{for(let c of document.cookie.split(";")){let[n,v]=c.trim().split("=");if(n==="_csrf")return decodeURIComponent(v)}return null})();if(!c){console.error("CSRF not found!");return}const t="query SearchMyAssets($page: Int, $pageSize: Int, $q: [String], $tagging: [String!], $assignFrom: [String!], $ids: [String!], $sortBy: Int, $reverse: Boolean, $other: String) {\\n  searchMyAssets(page: $page, pageSize: $pageSize, q: $q, tagging: $tagging, assignFrom: $assignFrom, ids: $ids, sortBy: $sortBy, reverse: $reverse, other: $other) {\\n    results {\\n      id\\n      orderId\\n      grantTime\\n      tagging\\n      assignFrom\\n      product {\\n        id\\n        productId\\n        itemId\\n        name\\n        mainImage {\\n          icon75\\n          icon\\n          __typename\\n        }\\n        publisher {\\n          id\\n          name\\n          __typename\\n        }\\n        publishNotes\\n        state\\n        currentVersion {\\n          name\\n          publishedDate\\n          __typename\\n        }\\n        downloadSize\\n        __typename\\n      }\\n      __typename\\n    }\\n    organizations\\n    total\\n    __typename\\n  }\\n}\\n";async function n(p,g=[]){return(await(await fetch(e,{method:"POST",headers:{"Content-Type":"application/json;charset=UTF-8","Accept":"application/json, text/plain, */*","x-csrf-token":c,"x-requested-with":"XMLHttpRequest","x-source":"storefront","operations":"SearchMyAssets"},credentials:"include",body:JSON.stringify([{query:t,variables:{page:p,pageSize:100,q:[],tagging:g,ids:[],assignFrom:[],sortBy:7},operationName:"SearchMyAssets"}])})).json())[0]}async function f(l,g){console.log("Fetching "+l+"...");let a=await n(0,g),s=a.data.searchMyAssets.total,r=Math.ceil(s/100),o=[...a.data.searchMyAssets.results];for(let p=1;p<r;p++){console.log(l+" page "+(p+1)+"/"+r);o.push(...(await n(p,g)).data.searchMyAssets.results);await new Promise(r=>setTimeout(r,300))}console.log("Found "+o.length+" "+l);return o}let v=await f("visible",[]),h=await f("hidden",["#BIN"]),o=[...v,...h];console.log("Fetching wishlist...");let w=[];try{let u=(()=>{for(let c of document.cookie.split(";")){let[n,v]=c.trim().split("=");if(n.trim()==="LS")return v.split("-")[0]}return null})();let cr=await(await fetch(e,{method:"POST",headers:{"Content-Type":"application/json;charset=UTF-8","Accept":"application/json, text/plain, */*","x-csrf-token":c,"x-requested-with":"XMLHttpRequest","x-source":"storefront","operations":"ShoppingCartQuery"},credentials:"include",body:JSON.stringify([{query:'query ShoppingCartQuery{currentCart(namespace:"asset_store_saved_cart"){id cartId items{id product{id name mainImage{icon icon75 __typename}publisher{id name __typename}state __typename}__typename}__typename}}',operationName:"ShoppingCartQuery"}])})).json();let ci=cr[0]?.data?.currentCart?.items||[];for(let i of ci)if(i.product)w.push(i.product);let fr=await(await fetch(e,{method:"POST",headers:{"Content-Type":"application/json;charset=UTF-8","Accept":"application/json, text/plain, */*","x-csrf-token":c,"x-requested-with":"XMLHttpRequest","x-source":"storefront","operations":"ListDetail"},credentials:"include",body:JSON.stringify([{query:'query ListDetail{listDetail(listId:"favorite"){packages(size:200){results{...product __typename}total __typename}__typename}}\\nfragment product on Product{id productId itemId slug name publisher{id name __typename}mainImage{icon75 icon __typename}originalPrice{originalPrice finalPrice isFree currency __typename}state __typename}\\n',operationName:"ListDetail"}])})).json();let fi=fr[0]?.data?.listDetail?.packages?.results||[];let ids=new Set(w.map(i=>i.id));for(let i of fi)if(!ids.has(i.id))w.push(i);console.log("Found "+w.length+" wishlist items")}catch(ex){console.log("Wishlist fetch failed:",ex.message)}let l=[{data:{searchMyAssets:{count:o.length,results:o},wishlist:{count:w.length,results:w}}}],i=document.createElement("a");i.href=URL.createObjectURL(new Blob([JSON.stringify(l,null,2)],{type:"application/json"}));i.download="myassets.json";i.click();console.log("Downloaded "+o.length+" assets ("+v.length+" visible + "+h.length+" hidden) + "+w.length+" wishlist!")})();`;
    
    navigator.clipboard.writeText(minified).then(() => {
        const btn = document.querySelector('.copy-btn');
        btn.textContent = '✓ Copied!';
        btn.classList.add('copied');
        setTimeout(() => {
            btn.textContent = '📋 Copy Script';
            btn.classList.remove('copied');
        }, 2000);
    });
}

// File upload handling
function setupFileUpload() {
    const uploadArea = document.getElementById('upload-area');
    const fileInput = document.getElementById('file-input');

    // Drag and drop
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('drag-over');
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('drag-over');
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('drag-over');
        const file = e.dataTransfer.files[0];
        if (file) handleFile(file);
    });

    // Click to upload
    uploadArea.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) handleFile(file);
    });
}

// Handle uploaded file
function handleFile(file) {
    if (!file.name.endsWith('.json')) {
        alert('Please upload a JSON file');
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const data = JSON.parse(e.target.result);
            userAssets = parseUserAssets(data);
            wishlistAssets = parseWishlistItems(data);
            
            // Show file info
            const fileInfo = document.getElementById('file-info');
            fileInfo.innerHTML = `\u2705 <strong>${file.name}</strong> loaded - Found <strong>${userAssets.length}</strong> assets` + 
                (wishlistAssets.length > 0 ? ` and <strong>${wishlistAssets.length}</strong> wishlist items` : '');
            fileInfo.classList.remove('hidden');
            
            // Run scanner
            scanAssets();
        } catch (err) {
            alert('Error parsing JSON file: ' + err.message);
            console.error(err);
        }
    };
    reader.readAsText(file);
}

// Parse user assets from Unity export format
function parseUserAssets(data) {
    const assets = [];
    
    // Handle array format (from export script)
    if (Array.isArray(data)) {
        for (const item of data) {
            if (item.data && item.data.searchMyAssets) {
                const results = item.data.searchMyAssets.results || [];
                for (const result of results) {
                    const product = result.product;
                    if (product) {
                        assets.push({
                            id: product.id,
                            productId: product.productId,
                            itemId: product.itemId,
                            name: product.name,
                            publisher: product.publisher?.name || 'Unknown',
                            publisherId: product.publisher?.id,
                            icon: product.mainImage?.icon75 || product.mainImage?.icon,
                            state: product.state,
                            grantTime: result.grantTime
                        });
                    }
                }
            }
        }
    }
    // Handle direct object format
    else if (data.data && data.data.searchMyAssets) {
        const results = data.data.searchMyAssets.results || [];
        for (const result of results) {
            const product = result.product;
            if (product) {
                assets.push({
                    id: product.id,
                    productId: product.productId,
                    itemId: product.itemId,
                    name: product.name,
                    publisher: product.publisher?.name || 'Unknown',
                    publisherId: product.publisher?.id,
                    icon: product.mainImage?.icon75 || product.mainImage?.icon,
                    state: product.state,
                    grantTime: result.grantTime
                });
            }
        }
    }
    
    return assets;
}

// Parse wishlist items from export format
function parseWishlistItems(data) {
    const items = [];
    
    if (Array.isArray(data)) {
        for (const item of data) {
            if (item.data && item.data.wishlist) {
                const results = item.data.wishlist.results || [];
                for (const product of results) {
                    items.push({
                        id: product.id,
                        name: product.name,
                        publisher: product.publisher?.name || 'Unknown',
                        publisherId: product.publisher?.id,
                        icon: product.mainImage?.icon75 || product.mainImage?.icon,
                        state: product.state
                    });
                }
            }
        }
    } else if (data.data && data.data.wishlist) {
        const results = data.data.wishlist.results || [];
        for (const product of results) {
            items.push({
                id: product.id,
                name: product.name,
                publisher: product.publisher?.name || 'Unknown',
                publisherId: product.publisher?.id,
                icon: product.mainImage?.icon75 || product.mainImage?.icon,
                state: product.state
            });
        }
    }
    
    return items;
}

// Normalize string for comparison
function normalize(str) {
    if (!str) return '';
    return str.toLowerCase()
        .replace(/[^\w\s]/g, '')
        .replace(/\s+/g, ' ')
        .trim();
}

// Match an asset against removal maps, returns {removedEntry, matchType} or null
function findRemovalMatch(asset, removedByName, removedByPublisher) {
    const normalizedName = normalize(asset.name);
    const normalizedPublisher = normalize(asset.publisher);
    
    let match = null;
    let matchType = null;

    // Try exact name match first
    if (removedByName.has(normalizedName)) {
        match = removedByName.get(normalizedName);
        matchType = 'exact';
    }
    
    // Try partial name match
    if (!match) {
        for (const [removedName, removed] of removedByName) {
            if (removedName.length > 10 && normalizedName.length > 10) {
                if (removedName.includes(normalizedName) || normalizedName.includes(removedName)) {
                    match = removed;
                    matchType = 'partial';
                    break;
                }
            }
        }
    }

    // Check if publisher is being removed (all their assets)
    if (!match && removedByPublisher.has(normalizedPublisher)) {
        const publisherAssets = removedByPublisher.get(normalizedPublisher);
        for (const removed of publisherAssets) {
            if (normalize(removed.name) === normalizedName) {
                match = removed;
                matchType = 'publisher+name';
                break;
            }
        }
    }

    return match ? { removedEntry: match, matchType } : null;
}

// Scan assets against removal list
function scanAssets() {
    matchedAssets = [];
    matchedWishlist = [];
    
    // Check if removal data is loaded
    if (typeof REMOVED_ASSETS === 'undefined' || !REMOVED_ASSETS.length) {
        console.error('Removal assets data not loaded');
        return;
    }

    // Create lookup maps for removed assets
    const removedByName = new Map();
    const removedByPublisher = new Map();
    
    for (const removed of REMOVED_ASSETS) {
        if (removed.name) {
            const normalizedName = normalize(removed.name);
            removedByName.set(normalizedName, removed);
        }
        if (removed.publisher) {
            const normalizedPub = normalize(removed.publisher);
            if (!removedByPublisher.has(normalizedPub)) {
                removedByPublisher.set(normalizedPub, []);
            }
            removedByPublisher.get(normalizedPub).push(removed);
        }
    }

    // Check each user asset
    for (const asset of userAssets) {
        const result = findRemovalMatch(asset, removedByName, removedByPublisher);
        if (result) {
            matchedAssets.push({
                asset: asset,
                removedEntry: result.removedEntry,
                matchType: result.matchType
            });
        }
    }

    // Check wishlist items
    for (const asset of wishlistAssets) {
        const result = findRemovalMatch(asset, removedByName, removedByPublisher);
        if (result) {
            matchedWishlist.push({
                asset: asset,
                removedEntry: result.removedEntry,
                matchType: result.matchType
            });
        }
    }

    // Display results
    displayResults();
}

// Render a single asset item
function renderAssetItem(match) {
    const asset = match.asset;
    const icon = asset.icon ? (asset.icon.startsWith('//') ? 'https:' + asset.icon : asset.icon) : '';
    const assetUrl = `https://assetstore.unity.com/packages/slug/${asset.id}`;
    const acqInfo = getAcquisitionInfo(asset.grantTime);
    
    const refundBadge = acqInfo.eligible 
        ? `<span class="asset-badge badge-success">Refund Eligible (${acqInfo.daysUntilExpiry} days left)</span>`
        : '';
    
    const matchLabel = match.matchType === 'exact' ? 'Exact Match' 
        : match.matchType === 'publisher+name' ? 'Exact Match' 
        : 'Partial Match';
    const matchBadgeClass = match.matchType === 'partial' ? 'badge-partial' : 'badge-exact';
    const removingBadge = match.matchType !== 'partial' 
        ? '<span class="asset-badge badge-danger">Removing</span>' 
        : '';
    
    return `
        <div class="asset-item ${acqInfo.eligible ? 'refund-eligible' : ''}">
            ${icon ? `<img src="${icon}" alt="" class="asset-icon" onerror="this.style.display='none'">` : '<div class="asset-icon"></div>'}
            <div class="asset-info">
                <div class="asset-name">
                    <a href="${assetUrl}" target="_blank">${escapeHtml(asset.name)}</a>
                </div>
                <div class="asset-publisher">by ${escapeHtml(asset.publisher)}</div>
                <div class="asset-acquired">Acquired: ${acqInfo.text} (${acqInfo.date})</div>
            </div>
            <div class="asset-badges">
                <span class="asset-badge ${matchBadgeClass}">${matchLabel}</span>
                ${refundBadge}
                ${removingBadge}
            </div>
        </div>
    `;
}

// Render a wishlist item (no refund/acquisition info)
function renderWishlistItem(match) {
    const asset = match.asset;
    const icon = asset.icon ? (asset.icon.startsWith('//') ? 'https:' + asset.icon : asset.icon) : '';
    const assetUrl = `https://assetstore.unity.com/packages/slug/${asset.id}`;
    
    const matchLabel = match.matchType === 'exact' ? 'Exact Match' 
        : match.matchType === 'publisher+name' ? 'Exact Match' 
        : 'Partial Match';
    const matchBadgeClass = match.matchType === 'partial' ? 'badge-partial' : 'badge-exact';
    const removingBadge = match.matchType !== 'partial' 
        ? '<span class="asset-badge badge-danger">Removing</span>' 
        : '';
    
    return `
        <div class="asset-item">
            ${icon ? `<img src="${icon}" alt="" class="asset-icon" onerror="this.style.display='none'">` : '<div class="asset-icon"></div>'}
            <div class="asset-info">
                <div class="asset-name">
                    <a href="${assetUrl}" target="_blank">${escapeHtml(asset.name)}</a>
                </div>
                <div class="asset-publisher">by ${escapeHtml(asset.publisher)}</div>
            </div>
            <div class="asset-badges">
                <span class="asset-badge badge-wishlist">Wishlist</span>
                <span class="asset-badge ${matchBadgeClass}">${matchLabel}</span>
                ${removingBadge}
            </div>
        </div>
    `;
}

// Display scan results
function displayResults() {
    const resultsDiv = document.getElementById('results');
    const placeholder = document.getElementById('results-placeholder');
    
    placeholder.classList.add('hidden');
    resultsDiv.classList.remove('hidden');
    
    const totalAssets = userAssets.length;
    
    // Split into confirmed (exact) and potential (partial) matches
    const confirmedMatches = matchedAssets.filter(m => m.matchType !== 'partial');
    const potentialMatches = matchedAssets.filter(m => m.matchType === 'partial');
    const confirmedCount = confirmedMatches.length;
    const potentialCount = potentialMatches.length;
    const safeCount = totalAssets - confirmedCount - potentialCount;
    
    // Count refund eligible (only from confirmed)
    let refundEligibleCount = 0;
    for (const match of confirmedMatches) {
        const info = getAcquisitionInfo(match.asset.grantTime);
        if (info.eligible) refundEligibleCount++;
    }

    let html = `
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-value">${totalAssets}</div>
                <div class="stat-label">Total Assets</div>
            </div>
            <div class="stat-card danger">
                <div class="stat-value">${confirmedCount}</div>
                <div class="stat-label">Being Removed</div>
            </div>
            <div class="stat-card potential">
                <div class="stat-value">${potentialCount}</div>
                <div class="stat-label">Potential</div>
            </div>
            <div class="stat-card success">
                <div class="stat-value">${safeCount}</div>
                <div class="stat-label">Safe</div>
            </div>
            <div class="stat-card warning">
                <div class="stat-value">${refundEligibleCount}</div>
                <div class="stat-label">Refund Eligible</div>
            </div>
        </div>
    `;

    if (confirmedCount > 0) {
        html += `
            <div class="alert alert-danger">
                <span class="alert-icon">⚠️</span>
                <div>
                    <strong>Warning!</strong> ${confirmedCount} of your assets will be removed on March 31st, 2026.
                    <br>Download them before the deadline to keep access.
                </div>
            </div>
            
            <div class="asset-list-header">
                <h3>Assets Being Removed (${confirmedCount})</h3>
                <button class="download-btn" onclick="downloadReport()">📥 Download Report</button>
            </div>
            
            <div class="asset-list">
        `;
        
        if (refundEligibleCount > 0) {
            html += `
                <div class="alert alert-warning">
                    <span class="alert-icon">💰</span>
                    <div>
                        <strong>${refundEligibleCount} asset${refundEligibleCount > 1 ? 's' : ''} eligible for refund!</strong>
                        <br>These were purchased within the last 6 months. Look for the green "Refund Eligible" badge below.
                    </div>
                </div>
            `;
        }

        for (const match of confirmedMatches) {
            html += renderAssetItem(match);
        }

        html += `</div>`;
    }

    if (potentialCount > 0) {
        html += `
            <div class="alert alert-potential" style="margin-top: 2rem;">
                <span class="alert-icon">🔍</span>
                <div>
                    <strong>Heads up!</strong> ${potentialCount} of your assets partially match the removal list.
                    <br>These are not confirmed - verify them manually on the Asset Store.
                </div>
            </div>
            
            <div class="asset-list-header">
                <h3>Potential Matches (${potentialCount})</h3>
            </div>
            
            <div class="asset-list">
        `;

        for (const match of potentialMatches) {
            html += renderAssetItem(match);
        }

        html += `</div>`;
    }

    if (confirmedCount === 0 && potentialCount === 0) {
        html += `
            <div class="alert alert-success">
                <span class="alert-icon">✅</span>
                <div>
                    <strong>Good news!</strong> None of your assets appear to be on the removal list.
                    <br>Your library is safe!
                </div>
            </div>
        `;
    }

    // Wishlist section
    if (wishlistAssets.length > 0) {
        const wishlistConfirmed = matchedWishlist.filter(m => m.matchType !== 'partial');
        const wishlistPotential = matchedWishlist.filter(m => m.matchType === 'partial');
        
        html += `
            <div class="wishlist-section">
                <div class="wishlist-header">
                    <h3>🛒 Wishlist / Saved for Later (${wishlistAssets.length} items)</h3>
                </div>
        `;
        
        if (matchedWishlist.length > 0) {
            html += `
                <div class="stats-grid" style="margin-bottom: 1rem;">
                    <div class="stat-card danger">
                        <div class="stat-value">${wishlistConfirmed.length}</div>
                        <div class="stat-label">Being Removed</div>
                    </div>
                    <div class="stat-card potential">
                        <div class="stat-value">${wishlistPotential.length}</div>
                        <div class="stat-label">Potential</div>
                    </div>
                    <div class="stat-card success">
                        <div class="stat-value">${wishlistAssets.length - matchedWishlist.length}</div>
                        <div class="stat-label">Safe</div>
                    </div>
                </div>
            `;
            
            if (wishlistConfirmed.length > 0) {
                html += `
                    <div class="alert alert-danger">
                        <span class="alert-icon">🛒</span>
                        <div>
                            <strong>${wishlistConfirmed.length} wishlist item${wishlistConfirmed.length > 1 ? 's' : ''} will be removed.</strong>
                            <br>These items from your saved cart or favorites are on the removal list. Purchase before the deadline if you still want them.
                        </div>
                    </div>
                    <div class="asset-list">
                `;
                for (const match of wishlistConfirmed) {
                    html += renderWishlistItem(match);
                }
                html += `</div>`;
            }
            
            if (wishlistPotential.length > 0) {
                html += `
                    <div class="alert alert-potential" style="margin-top: 1rem;">
                        <span class="alert-icon">🔍</span>
                        <div>
                            <strong>${wishlistPotential.length} wishlist item${wishlistPotential.length > 1 ? 's' : ''} partially match the removal list.</strong>
                            <br>Verify manually on the Asset Store.
                        </div>
                    </div>
                    <div class="asset-list">
                `;
                for (const match of wishlistPotential) {
                    html += renderWishlistItem(match);
                }
                html += `</div>`;
            }
        } else {
            html += `
                <div class="alert alert-success">
                    <span class="alert-icon">✅</span>
                    <div>
                        <strong>All clear!</strong> None of your wishlist items are on the removal list.
                    </div>
                </div>
            `;
        }
        
        html += `</div>`;
    }

    resultsDiv.innerHTML = html;
}

// Download report as JSON
function downloadReport() {
    const report = {
        generatedAt: new Date().toISOString(),
        summary: {
            totalAssets: userAssets.length,
            confirmedRemovals: matchedAssets.filter(m => m.matchType !== 'partial').length,
            potentialRemovals: matchedAssets.filter(m => m.matchType === 'partial').length,
            safeAssets: userAssets.length - matchedAssets.length,
            refundEligible: matchedAssets.filter(m => m.matchType !== 'partial' && getAcquisitionInfo(m.asset.grantTime).eligible).length,
            wishlistTotal: wishlistAssets.length,
            wishlistAffected: matchedWishlist.length
        },
        affectedAssets: matchedAssets.map(m => {
            const acqInfo = getAcquisitionInfo(m.asset.grantTime);
            return {
                name: m.asset.name,
                publisher: m.asset.publisher,
                id: m.asset.id,
                url: `https://assetstore.unity.com/packages/slug/${m.asset.id}`,
                matchType: m.matchType,
                acquiredOn: acqInfo.date,
                acquiredAgo: acqInfo.text,
                refundEligible: acqInfo.eligible
            };
        }),
        affectedWishlist: matchedWishlist.map(m => ({
            name: m.asset.name,
            publisher: m.asset.publisher,
            id: m.asset.id,
            url: `https://assetstore.unity.com/packages/slug/${m.asset.id}`,
            matchType: m.matchType
        }))
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `unity-removal-scan-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

// Escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Calculate time since acquisition and refund eligibility
function getAcquisitionInfo(grantTime) {
    if (!grantTime) return { text: 'Unknown', eligible: false };
    
    const acquired = new Date(grantTime);
    const now = new Date();
    const diffMs = now - acquired;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffMonths = Math.floor(diffDays / 30);
    const diffYears = Math.floor(diffDays / 365);
    const sixMonthMs = 6 * 30 * 24 * 60 * 60 * 1000;
    const eligible = diffMs <= sixMonthMs;
    const daysUntilExpiry = eligible ? Math.ceil((sixMonthMs - diffMs) / (1000 * 60 * 60 * 24)) : 0;
    
    let text;
    if (diffDays < 1) {
        text = 'Today';
    } else if (diffDays === 1) {
        text = '1 day ago';
    } else if (diffDays < 30) {
        text = `${diffDays} days ago`;
    } else if (diffMonths === 1) {
        text = '1 month ago';
    } else if (diffMonths < 12) {
        text = `${diffMonths} months ago`;
    } else if (diffYears === 1) {
        const remainingMonths = diffMonths - 12;
        text = remainingMonths > 0 ? `1 year, ${remainingMonths} months ago` : '1 year ago';
    } else {
        text = `${diffYears} years ago`;
    }
    
    return { text, eligible, daysUntilExpiry, date: acquired.toLocaleDateString() };
}
