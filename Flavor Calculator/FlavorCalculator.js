let flavorCount = 0;

function addFlavor(name = '', percent = '5') {
    const container = document.getElementById('flavorsContainer');
    const div = document.createElement('div');
    div.className = 'flavor-row';
    div.id = `flavor-${flavorCount}`;
    div.innerHTML = `
        <input type="text" id="flavorName-${flavorCount}" placeholder="Назва ароматизатора" value="${name || 'Ароматизатор'}">
        <div class="input-percent-wrapper">
            <input type="number" id="flavorPercent-${flavorCount}" min="0" max="100" step="0.1" value="${percent}">
        </div>
        <button type="button" class="btn-remove" onclick="removeFlavor(${flavorCount})">×</button>
    `;
    container.appendChild(div);
    flavorCount++;
}

function removeFlavor(id) {
    const element = document.getElementById(`flavor-${id}`);
    if (element) {
        element.remove();
    }
}

function calculate() {
    try {
        const totalVolume = parseFloat(document.getElementById('totalVolume').value);
        const baseType = document.getElementById('baseType').value;
        const nicotineStrength = parseFloat(document.getElementById('nicotineStrength').value);
        const [baseVG, basePG] = baseType.split('/').map(Number);
        const flavors = [];
        let totalFlavorPercent = 0;

        for (let i = 0; i < flavorCount; i++) {
            const nameElement = document.getElementById(`flavorName-${i}`);
            const percentElement = document.getElementById(`flavorPercent-${i}`);
            if (nameElement && percentElement) {
                const name = nameElement.value.trim();
                const percent = parseFloat(percentElement.value) || 0;
                if (name && percent > 0) {
                    flavors.push({ name, percent });
                    totalFlavorPercent += percent;
                }
            }
        }

        if (isNaN(totalVolume) || totalVolume <= 0) {
            alert('Будь ласка, введіть коректний загальний об\'єм');
            return;
        }
        if (flavors.length === 0) {
            alert('Будь ласка, додайте хоча б один ароматизатор');
            return;
        }
        if (totalFlavorPercent <= 0 || totalFlavorPercent > 30) {
            alert('Загальний відсоток ароматизаторів повинен бути від 0% до 30%');
            return;
        }

        const flavorVolume = totalVolume * totalFlavorPercent / 100;
        const baseVolume = totalVolume - flavorVolume;
        const totalPGFromBase = baseVolume * basePG / 100;
        const totalVGFromBase = baseVolume * baseVG / 100;
        const totalPGFromFlavors = flavorVolume;

        const finalPG = totalPGFromBase + totalPGFromFlavors;
        const finalVG = totalVGFromBase;
        const finalTotal = finalPG + finalVG;
        const finalVGRatio = (finalVG / finalTotal) * 100;
        const finalPGRatio = (finalPG / finalTotal) * 100;
        const finalNicotineStrength = (baseVolume * nicotineStrength) / totalVolume;

        document.getElementById('baseResult').innerHTML = 
            `<strong>База:</strong> ${baseVolume.toFixed(2)} мл (${baseVG} VG / ${basePG} PG)`;                
        
        let flavorsText = '<strong>Ароматизатори:</strong><br>';
        flavors.forEach(flavor => {
    const volume = totalVolume * flavor.percent / 100;
    flavorsText += `${flavor.name}: ${volume.toFixed(2)} мл (${flavor.percent.toFixed(2)}%)<br>`;
});
        document.getElementById('flavorsResult').innerHTML = flavorsText;

        document.getElementById('finalRatio').innerHTML = 
            `<strong>Кінцеве співвідношення:</strong> ${finalVGRatio.toFixed(2)} VG / ${finalPGRatio.toFixed(2)} PG`;

        document.getElementById('nicotineResult').innerHTML = 
            `<strong>Вміст нікотину:</strong> ${finalNicotineStrength.toFixed(2)} мг/мл`;

        const resultDiv = document.getElementById('result');
        const warningDiv = document.getElementById('vgWarning');

        if (finalVGRatio < 50) {
            const neededVG = (0.5 * finalTotal - finalVG) / 0.5;
            const newTotal = totalVolume + neededVG;
            const newFinalVG = finalVG + neededVG;
            const newFinalPG = finalPG;
            const newFlavorVolume = flavorVolume;
            const newNicotineStrength = (baseVolume * nicotineStrength) / newTotal;

            const newVGPercent = (newFinalVG / newTotal) * 100;
            const newPGPercent = (newFinalPG / newTotal) * 100;
            const newFlavorPercent = (newFlavorVolume / newTotal) * 100;

            warningDiv.innerHTML = `
                <strong>Увага:</strong> VG менше 50%. Додайте ${neededVG.toFixed(2)} мл чистого VG для досягнення 50/50 співвідношення.<br>
                <div class="new_param" style="color:#2c3e50;">
                    <strong>Нові параметри після додавання VG:</strong><br>
                    - Новий об'єм: ${newTotal.toFixed(2)} мл<br>
                    - VG/PG: ${newVGPercent.toFixed(2)} / ${newPGPercent.toFixed(2)}<br>
                    - Ароматизатори: ${newFlavorPercent.toFixed(2)}%<br>
                    - Нікотин: ${newNicotineStrength.toFixed(2)} мг/мл
                </div>
            `;
            warningDiv.className = 'warning';
        } else {
            warningDiv.innerHTML = '';
            warningDiv.className = '';
        }

        resultDiv.style.display = 'block';
    } catch (e) {
        alert('Сталася помилка при розрахунку: ' + e.message);
    }
}

function getCurrentRecipeData() {
    const totalVolume = parseFloat(document.getElementById('totalVolume').value) || 0;
    const baseType = document.getElementById('baseType').value;
    const nicotineStrength = parseFloat(document.getElementById('nicotineStrength').value) || 0;
    const flavors = [];

    for (let i = 0; i < flavorCount; i++) {
        const nameElement = document.getElementById(`flavorName-${i}`);
        const percentElement = document.getElementById(`flavorPercent-${i}`);
        if (nameElement && percentElement) {
            const name = nameElement.value.trim();
            const percent = parseFloat(percentElement.value) || 0;
            if (name && percent > 0) {
                flavors.push({ name, percent });
            }
        }
    }

    return {
        totalVolume,
        baseType,
        nicotineStrength,
        flavors,
        savedAt: new Date().toISOString(),
    };
}

function getSavedRecipes() {
    try {
        return JSON.parse(localStorage.getItem('vapeRecipes') || '[]');
    } catch (e) {
        return [];
    }
}

function saveRecipeToLocalStorage(recipe) {
    const recipes = getSavedRecipes();
    recipes.push(recipe);
    localStorage.setItem('vapeRecipes', JSON.stringify(recipes));
}

function openSaveModal() {
    document.getElementById('recipeName').value = '';
    document.getElementById('recipeDesc').value = '';
    document.getElementById('saveModal').classList.remove('hidden');
}

function closeSaveModal() {
    document.getElementById('saveModal').classList.add('hidden');
}

function openRecipesModal() {
    renderRecipesList();
    document.getElementById('recipesModal').classList.remove('hidden');
}

function closeRecipesModal() {
    document.getElementById('recipesModal').classList.add('hidden');
}

function renderRecipesList() {
    const list = document.getElementById('recipesList');
    const noRecipesMessage = document.getElementById('noRecipesMessage');
    const recipes = getSavedRecipes();
    list.innerHTML = '';

    if (recipes.length === 0) {
        noRecipesMessage.style.display = 'block';
        return;
    }

    noRecipesMessage.style.display = 'none';

    recipes.reverse().forEach(recipe => {
        const recipeCard = document.createElement('div');
        recipeCard.className = 'recipe-card';
        recipeCard.innerHTML = `
            <h3>${recipe.name}</h3>
            <p>${recipe.description || 'Без опису'}</p>
            <p style="font-size:0.9rem;color:#566270;margin-top:10px;"><strong>Об'єм:</strong> ${recipe.data.totalVolume} мл · <strong>База:</strong> ${recipe.data.baseType} · <strong>Нікотин:</strong> ${recipe.data.nicotineStrength} мг/мл</p>
        `;
        list.appendChild(recipeCard);
    });
}

function saveRecipe() {
    const name = document.getElementById('recipeName').value.trim();
    const description = document.getElementById('recipeDesc').value.trim();

    if (!name) {
        alert('Введіть назву рецепту.');
        return;
    }

    const recipe = {
        name,
        description,
        data: getCurrentRecipeData(),
    };

    saveRecipeToLocalStorage(recipe);
    closeSaveModal();
    alert('Рецепт збережено.');
}

window.onload = function() {
    addFlavor('', 15);
    document.getElementById('saveRecipeBtn').addEventListener('click', openSaveModal);
    document.getElementById('viewRecipesBtn').addEventListener('click', openRecipesModal);
    document.getElementById('closeSaveModal').addEventListener('click', closeSaveModal);
    document.getElementById('closeRecipesModal').addEventListener('click', closeRecipesModal);
    document.getElementById('saveRecipeConfirm').addEventListener('click', saveRecipe);
};