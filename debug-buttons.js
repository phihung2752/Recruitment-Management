// Debug script to test button functionality
console.log('🔧 Debug script loaded');

// Test basic JavaScript functionality
function testBasicJS() {
    console.log('✅ Basic JavaScript is working');
    return true;
}

// Test button click detection
function testButtonClick(buttonId) {
    console.log(`🔥 Button ${buttonId} clicked!`);
    return true;
}

// Test navigation
function testNavigation(url) {
    console.log(`🔄 Navigation test to: ${url}`);
    // Don't actually navigate, just log
    return true;
}

// Test API calls
async function testAPICall() {
    console.log('🔄 Testing API call...');
    try {
        const response = await fetch('/api/admin/stats');
        console.log('✅ API response status:', response.status);
        if (response.ok) {
            const data = await response.json();
            console.log('✅ API data received:', data);
        }
    } catch (error) {
        console.error('❌ API call failed:', error);
    }
}

// Auto-run basic tests
console.log('🚀 Running basic tests...');
testBasicJS();

// Test if we can detect clicks on existing buttons
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 DOM loaded, setting up button listeners...');
    
    // Find all buttons with onClick handlers
    const buttons = document.querySelectorAll('button[onclick]');
    console.log(`🔍 Found ${buttons.length} buttons with onclick handlers`);
    
    // Add additional click listeners for debugging
    buttons.forEach((button, index) => {
        button.addEventListener('click', function(e) {
            console.log(`🔥 Button ${index} clicked via addEventListener`);
        });
    });
    
    // Test API call
    testAPICall();
});

console.log('🔧 Debug script setup complete');

