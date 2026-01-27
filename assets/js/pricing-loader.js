document.addEventListener('DOMContentLoaded', function() {
    if (typeof firebase === 'undefined') return;
    
    // Ensure Firestore is initialized
    // Note: firebase-init.js initializes 'app', but we need to ensure firestore is accessed from that app
    const db = firebase.firestore();
    
    db.collection("pricing_services").get().then((querySnapshot) => {
      if (querySnapshot.empty) return; // Keep default static HTML if no DB data
  
      console.log("Dynamic pricing data found. Rendering...");
      
      const categories = {};
      querySnapshot.forEach(doc => {
        const data = doc.data();
        const cat = data.category || 'General';
        if(!categories[cat]) categories[cat] = [];
        categories[cat].push(data);
      });
  
      // Build new HTML structure matches the theme somewhat
      let newHtml = '<div class="dynamic-pricing-section" style="max-width: 1200px; margin: 0 auto;">';
      
      // Order categories if needed, for now object order (random-ish)
      for (const [cat, services] of Object.entries(categories)) {
         newHtml += `<h3 style="margin-top: 30px; margin-bottom: 15px; border-bottom: 2px solid #ccc; padding-bottom: 10px;">${cat}</h3>`;
         newHtml += `<table style="width:100%; border-collapse: collapse; margin-bottom: 20px;"><tbody>`;
         
         services.forEach(s => {
           newHtml += `
            <tr>
                <td style="padding: 12px; border-bottom: 1px solid #eee; font-size: 16px;"><strong>${s.name}</strong></td>
                <td style="padding: 12px; border-bottom: 1px solid #eee; font-size: 16px; font-weight: bold; text-align: right; color: #d32f2f;">${s.price}</td>
            </tr>`;
         });
         
         newHtml += `</tbody></table>`;
      }
      newHtml += '</div>';
  
      // Injection Logic
      const main = document.getElementById('page-content');
      if(main) {
         // Try to find the existing tables to replace them
         const existingTables = main.querySelectorAll('table');
         
         if(existingTables.length > 0) {
            // Hide all existing tables
            existingTables.forEach(t => t.style.display = 'none');
            
            // Insert our new container before the first table
            const wrapper = document.createElement('div');
            wrapper.innerHTML = newHtml;
            existingTables[0].parentNode.insertBefore(wrapper, existingTables[0]);
         } else {
             // Fallback: Append to main
             main.insertAdjacentHTML('beforeend', newHtml);
         }
      }
    }).catch(err => {
        console.error("Error loading pricing:", err);
    });
  });
  