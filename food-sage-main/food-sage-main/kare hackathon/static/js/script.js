document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const uploadBtn = document.getElementById('uploadBtn');
    const captureBtn = document.getElementById('captureBtn');
    const analyzeBtn = document.getElementById('analyzeBtn');
    const imageUpload = document.getElementById('imageUpload');
    const imagePreview = document.getElementById('imagePreview');
    const scannerAnimation = document.querySelector('.scanner-animation');
    const notification = document.getElementById('notification');
    const notificationMessage = document.getElementById('notificationMessage');
    
    // Sample food database (in a real app, this would be much more comprehensive)
    const foodDatabase = {
        'apple': {
            name: 'Apple',
            type: 'Fruit',
            state: 'Raw',
            ph: 3.3,
            freshness: 85,
            freshnessDuration: '5-7 days at room temperature',
            edible: true,
            spoiled: false,
            calories: 95,
            carbs: 25,
            protein: 0.5,
            fat: 0.3,
            pros: [
                'High in fiber and vitamin C',
                'Low in calories',
                'Contains antioxidants',
                'May support heart health'
            ],
            cons: [
                'Contains natural sugars',
                'May cause bloating in some people'
            ],
            recipes: [
                {
                    name: 'Apple Pie',
                    image: 'https://source.unsplash.com/random/300x200/?apple,pie'
                },
                {
                    name: 'Apple Smoothie',
                    image: 'https://source.unsplash.com/random/300x200/?apple,smoothie'
                },
                {
                    name: 'Apple Salad',
                    image: 'https://source.unsplash.com/random/300x200/?apple,salad'
                }
            ]
        },
        'banana': {
            name: 'Banana',
            type: 'Fruit',
            state: 'Raw',
            ph: 5.0,
            freshness: 70,
            freshnessDuration: '2-3 days at room temperature',
            edible: true,
            spoiled: false,
            calories: 105,
            carbs: 27,
            protein: 1.3,
            fat: 0.4,
            pros: [
                'Rich in potassium',
                'Good source of vitamin B6',
                'Contains fiber',
                'Natural energy booster'
            ],
            cons: [
                'High in sugar',
                'Can overripen quickly'
            ],
            recipes: [
                {
                    name: 'Banana Bread',
                    image: 'https://source.unsplash.com/random/300x200/?banana,bread'
                },
                {
                    name: 'Banana Smoothie',
                    image: 'https://source.unsplash.com/random/300x200/?banana,smoothie'
                },
                {
                    name: 'Banana Pancakes',
                    image: 'https://source.unsplash.com/random/300x200/?banana,pancakes'
                }
            ]
        },
        'chicken_breast': {
            name: 'Chicken Breast',
            type: 'Poultry',
            state: 'Cooked',
            ph: 6.2,
            freshness: 90,
            freshnessDuration: '3-4 days refrigerated',
            edible: true,
            spoiled: false,
            calories: 165,
            carbs: 0,
            protein: 31,
            fat: 3.6,
            pros: [
                'High in protein',
                'Low in fat',
                'Rich in B vitamins',
                'Versatile cooking ingredient'
            ],
            cons: [
                'Can dry out if overcooked',
                'Must be properly stored'
            ],
            recipes: [
                {
                    name: 'Grilled Chicken',
                    image: 'https://source.unsplash.com/random/300x200/?grilled,chicken'
                },
                {
                    name: 'Chicken Salad',
                    image: 'https://source.unsplash.com/random/300x200/?chicken,salad'
                },
                {
                    name: 'Chicken Stir Fry',
                    image: 'https://source.unsplash.com/random/300x200/?chicken,stirfry'
                }
            ]
        },
        'spoiled_milk': {
            name: 'Milk',
            type: 'Dairy',
            state: 'Liquid',
            ph: 4.5,
            freshness: 10,
            freshnessDuration: 'Expired',
            edible: false,
            spoiled: true,
            calories: 103,
            carbs: 12,
            protein: 8,
            fat: 2.4,
            pros: [
                'Normally good source of calcium',
                'Contains vitamin D',
                'Provides protein'
            ],
            cons: [
                'Spoiled - do not consume',
                'May cause food poisoning',
                'Sour smell and taste'
            ],
            recipes: []
        }
    };
    
    // Show notification
    function showNotification(message, duration = 3000) {
        notificationMessage.textContent = message;
        notification.classList.add('show');
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, duration);
    }
    
    // Initialize with a welcome message
    showNotification('Food Sage System Initialized. Ready to analyze!', 4000);
    
    // Handle image upload
    uploadBtn.addEventListener('click', function() {
        imageUpload.click();
    });
    
    imageUpload.addEventListener('change', function(e) {
        if (e.target.files.length > 0) {
            const file = e.target.files[0];
            const reader = new FileReader();
            
            reader.onload = function(event) {
                // Clear previous image
                const existingImg = imagePreview.querySelector('img');
                if (existingImg) {
                    existingImg.remove();
                }
                
                // Create new image
                const img = document.createElement('img');
                img.src = event.target.result;
                img.style.display = 'block';
                
                // Hide the upload prompt
                imagePreview.querySelector('i').style.display = 'none';
                imagePreview.querySelector('p').style.display = 'none';
                
                // Add the image to preview
                imagePreview.appendChild(img);
                
                // Enable analyze button
                analyzeBtn.disabled = false;
                
                showNotification('Image loaded successfully. Ready to analyze!');
            };
            
            reader.readAsDataURL(file);
        }
    });
    
    // Handle capture button (simulated in this demo)
    captureBtn.addEventListener('click', function() {
        // In a real app, this would access the device camera
        // For demo purposes, we'll simulate capturing an image
        showNotification('Camera not implemented in demo. Please upload an image.');
    });
    
    // Handle analyze button
    analyzeBtn.addEventListener('click', function() {
        // Show scanning animation
        scannerAnimation.style.display = 'block';
        scannerAnimation.style.opacity = '1';
        
        // Disable buttons during analysis
        uploadBtn.disabled = true;
        captureBtn.disabled = true;
        analyzeBtn.disabled = true;
        
        showNotification('Analyzing food...', 2000);
        
        // Simulate analysis delay
        setTimeout(() => {
            // Hide scanning animation
            scannerAnimation.style.opacity = '0';
            
            // Get the uploaded image
            const img = imagePreview.querySelector('img');
            
            if (img) {
                // In a real app, this would use computer vision to identify the food
                // For this demo, we'll randomly pick a food from our database
                const foodKeys = Object.keys(foodDatabase);
                const randomFoodKey = foodKeys[Math.floor(Math.random() * foodKeys.length)];
                const foodData = foodDatabase[randomFoodKey];
                
                // Update UI with food data
                updateFoodAnalysisUI(foodData);
                
                showNotification(`Analysis complete: ${foodData.name} identified!`);
            }
            
            // Re-enable buttons
            uploadBtn.disabled = false;
            captureBtn.disabled = false;
        }, 3000);
    });
    
    // Update UI with food analysis results
    function updateFoodAnalysisUI(foodData) {
        // Basic info
        document.getElementById('foodName').textContent = foodData.name;
        document.getElementById('foodType').textContent = foodData.type;
        document.getElementById('foodState').textContent = foodData.state;
        
        // Health info
        document.getElementById('freshnessValue').textContent = `${foodData.freshness}%`;
        document.getElementById('phValue').textContent = foodData.ph.toFixed(1);
        document.getElementById('remainingFresh').textContent = foodData.freshnessDuration;
        
        // Set freshness progress bar
        const freshnessBar = document.getElementById('freshnessBar');
        freshnessBar.style.width = `${foodData.freshness}%`;
        
        // Set edibility
        const edibilityValue = document.getElementById('edibilityValue');
        edibilityValue.textContent = foodData.edible ? (foodData.spoiled ? 'CAUTION' : 'EDIBLE') : 'NOT EDIBLE';
        edibilityValue.className = 'info-value edibility-badge ' + 
            (foodData.edible ? (foodData.spoiled ? 'caution' : 'edible') : 'not-edible');
        
        // Nutrition facts
        document.getElementById('caloriesValue').textContent = foodData.calories;
        document.getElementById('carbsValue').textContent = `${foodData.carbs}g`;
        document.getElementById('proteinValue').textContent = `${foodData.protein}g`;
        document.getElementById('fatValue').textContent = `${foodData.fat}g`;
        
        // Pros & Cons
        const prosList = document.getElementById('prosList');
        const consList = document.getElementById('consList');
        
        prosList.innerHTML = '';
        consList.innerHTML = '';
        
        foodData.pros.forEach(pro => {
            const li = document.createElement('li');
            li.textContent = pro;
            prosList.appendChild(li);
        });
        
        foodData.cons.forEach(con => {
            const li = document.createElement('li');
            li.textContent = con;
            consList.appendChild(li);
        });
        
        // Recipes
        const recipesContainer = document.getElementById('recipesContainer');
        const recipesGrid = document.getElementById('recipesGrid');
        
        recipesGrid.innerHTML = '';
        
        if (foodData.recipes.length > 0) {
            recipesContainer.style.display = 'block';
            
            foodData.recipes.forEach(recipe => {
                const recipeCard = document.createElement('div');
                recipeCard.className = 'recipe-card fade-in';
                recipeCard.innerHTML = `
                    <div class="recipe-image" style="background-image: url('${recipe.image}')"></div>
                    <div class="recipe-name">${recipe.name}</div>
                    <div class="recipe-details">
                        <span>${foodData.name} Recipe</span>
                        <span><i class="fas fa-utensils"></i></span>
                    </div>
                `;
                recipesGrid.appendChild(recipeCard);
            });
        } else {
            recipesContainer.style.display = 'none';
        }
        
        // Animate the results
        const resultCards = document.querySelectorAll('.result-card');
        resultCards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
            card.classList.add('fade-in');
        });
    }
    
    // Initialize with a sample analysis for demo purposes
    setTimeout(() => {
        // Randomly select a food to demonstrate the UI
        const sampleFoods = ['apple', 'banana', 'chicken_breast', 'spoiled_milk'];
        const randomFood = sampleFoods[Math.floor(Math.random() * sampleFoods.length)];
        updateFoodAnalysisUI(foodDatabase[randomFood]);
    }, 1000);
});