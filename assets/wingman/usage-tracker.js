// In-memory usage tracking (for serverless)
// Note: This resets on each cold start, but client-side localStorage handles credit tracking

const users = new Map();

function getUserKey(ip, userAgent) {
    const crypto = require('crypto');
    return crypto.createHash('sha256').update(ip + userAgent).digest('hex').substring(0, 16);
}

function hasUsedFree(userKey) {
    const user = users.get(userKey);
    return user && user.usedFree;
}

function hasCredits(userKey) {
    const user = users.get(userKey);
    return user && user.credits > 0;
}

function addCredits(userKey, amount = 5) {
    let user = users.get(userKey);
    if (!user) {
        user = {
            firstUse: new Date().toISOString(),
            totalUses: 0,
            usedFree: false,
            credits: 0
        };
    }
    user.credits += amount;
    users.set(userKey, user);
    return user.credits;
}

function recordUsage(userKey, paid = false) {
    let user = users.get(userKey);
    if (!user) {
        user = {
            firstUse: new Date().toISOString(),
            totalUses: 0,
            usedFree: false,
            credits: 0
        };
    }
    
    user.totalUses++;
    user.lastUse = new Date().toISOString();
    
    if (!paid) {
        user.usedFree = true;
    } else {
        user.credits--;
    }
    
    users.set(userKey, user);
    return user.totalUses;
}

function getTotalUsers() {
    return users.size;
}

function getStats() {
    let totalUses = 0;
    users.forEach(user => {
        totalUses += user.totalUses;
    });
    
    return {
        totalUses,
        uniqueUsers: users.size
    };
}

module.exports = {
    getUserKey,
    hasUsedFree,
    hasCredits,
    addCredits,
    recordUsage,
    getTotalUsers,
    getStats
};
