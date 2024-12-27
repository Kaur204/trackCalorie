import Storage from './storage'

class calorietracker{
    constructor()
    {
        this._calorieLimit= Storage.getCalorieLimit();
        this._totalCal=Storage.getTotalCal();
        this._meals=Storage.getMeals();
        this._workouts=Storage.getWorkouts();

        this._displayCalorieTotal();
        this._displayCalorieLimit();
        this._displayCalConsumed();
        this._displayCalBurned();
        this._displayCalRemaining();
        this._displayCalProgress();

        document.getElementById('limit').value= this._calorieLimit;
    }

    // public methods/ API
    addMeal(meal)
    {
        this._meals.push(meal);
        this._totalCal+= meal.calories;
        Storage.updateTotalCal(this._totalCal);
        Storage.saveMeal(meal);
        this._displayNewMeal(meal);
        this._render();
    }

    addWorkout(workout)
    {
        this._workouts.push(workout);
        this._totalCal-= workout.calories;
        Storage.updateTotalCal(this._totalCal);
        Storage.saveWorkout(workout);
        this._displayNewWorkout(workout);
        this._render();
    }

    removeMeal(id)
    {
        const idx= this._meals.findIndex((meal)=> {
           return  meal.id===id;
        });

        if(idx!==-1)
        {
            const meal= this._meals[idx];
            this._totalCal-=meal.calories;
            Storage.updateTotalCal(this._totalCal);
            Storage.removeMeal(id);
            this._meals.splice(idx, 1);
            this._render();
        }
    }

    removeWorkout(id)
    {
        const idx= this._workouts.findIndex((workout)=> {
           return  workout.id===id;
        });

        if(idx!==-1)
        {
            const workout= this._workouts[idx];
            this._totalCal+=workout.calories;
            Storage.updateTotalCal(this._totalCal);
            Storage.removeWorkout(id);
            this._workouts.splice(idx, 1);
            this._render();
        }
    }

    reset()
    {
        this._totalCal=0;
        this._meals=[];
        this._workouts=[];
        Storage.clearAll();
        this._render();
    }

    setLimit(calorieLimit)
    {
        this._calorieLimit=calorieLimit;
        Storage.setCalorieLimit(calorieLimit);
        this._displayCalorieLimit();
        this._render();
    }


    loadItems()
    {
        this._meals.forEach(meal=> this._displayNewMeal(meal));
        this._workouts.forEach(workout=> this._displayNewWorkout(workout));
    }

    // private methods

    // in vanilla js we have to cause it to render it
    // JavaScript rendering is the process of executing JavaScript on a page to make changes in the page's structure or content. It's also called client-side rendering, the opposite of server-side rendering.
    _displayCalorieTotal()
    {
        const totalCalEl= document.getElementById('calories-total');
        totalCalEl.innerHTML= this._totalCal;
    }

    _displayCalorieLimit()
    {
        const calLimitEl= document.getElementById('calories-limit');
        calLimitEl.innerHTML= this._calorieLimit;
    }

    _displayCalConsumed()
    {
        const calConsumedEl= document.getElementById('calories-consumed');

        // The reduce() method in JavaScript is used to iterate over an array and reduce it to a single value. It processes each element in the array sequentially and applies a callback function, accumulating the results into a single output value. It is often used for operations like summing numbers, flattening arrays, or constructing objects.
        // array.reduce(callback(accumulator, currentValue[, index[, array]])[, initialValue])

        const consumed = this._meals.reduce((total, meal) => {
            return total + meal.calories;
        }, 0);

        calConsumedEl.innerHTML= consumed;
        // console.log(consumed);
    }

    _displayCalBurned()
    {
        const calBurnedEl= document.getElementById('calories-burned');

        const burned = this._workouts.reduce((total, workout) => {
            return total + workout.calories;
        }, 0);

        calBurnedEl.innerHTML= burned;    
    }

    _displayCalRemaining()
    {
        const calRemainingEl= document.getElementById('calories-remaining');
        const progressEl= document.getElementById('calorie-progress');

        const remaining = this._calorieLimit- this._totalCal;
        calRemainingEl.innerHTML= remaining; 
        

        // parentElement isliy use hua kyoki id wali div se 2 upar tha vo bg-light wala div
        if(remaining<=0)
        {
            calRemainingEl.parentElement.parentElement.classList.remove('bg-light');
            calRemainingEl.parentElement.parentElement.classList.add('bg-danger');

            progressEl.classList.remove('bs-green');
            progressEl.classList.add('bg-danger');
        }
        else
        {
            calRemainingEl.parentElement.parentElement.classList.remove('bg-danger');
            calRemainingEl.parentElement.parentElement.classList.add('bg-light');

            progressEl.classList.remove('bg-danger');
            progressEl.classList.add('bs-green');
        }
    }

    _displayCalProgress()
    {
        const progressEl= document.getElementById('calorie-progress');
        const percentage = (this._totalCal/this._calorieLimit)*100;
        const width= Math.min(percentage, 100);
        progressEl.style.width=`${width}%`;
    }

    _displayNewMeal(meal)
    {
        const mealsEl= document.getElementById('meal-items');
        const mealEl= document.createElement('div');
        mealEl.classList.add('card', 'my-2');
        mealEl.setAttribute('data-id', meal.id);
        mealEl.innerHTML=`
        <div class="card-body">
        <div class="d-flex align-items-center justify-content-between">
            <h4 class="mx-1">${meal.name}</h4>
            <div
            class="fs-1 bg-primary text-white text-center rounded-2 px-2 px-sm-5"
            >
            ${meal.calories}
            </div>
            <button class="delete btn btn-danger btn-sm mx-2">
            <i class="fa-solid fa-xmark"></i>
            </button>
        </div>
        </div>`;

        mealsEl.appendChild(mealEl);

    }

    _displayNewWorkout(workout)
    {
        const workoutsEl= document.getElementById('workout-items');
        const workoutEl= document.createElement('div');
        workoutEl.classList.add('card', 'my-2');
        workoutEl.setAttribute('data-id', workout.id);
        workoutEl.innerHTML=`
        <div class="card-body">
        <div class="d-flex align-items-center justify-content-between">
            <h4 class="mx-1">${workout.name}</h4>
            <div
            class="fs-1 bg-secondary text-white text-center rounded-2 px-2 px-sm-5"
            >
            ${workout.calories}
            </div>
            <button class="delete btn btn-danger btn-sm mx-2">
            <i class="fa-solid fa-xmark"></i>
            </button>
        </div>
        </div>`;

        workoutsEl.appendChild(workoutEl);

    }

    _render()
    {
        this._displayCalorieTotal();
        this._displayCalConsumed();
        this._displayCalBurned();
        this._displayCalRemaining();
        this._displayCalProgress();
    }
}

export default calorietracker;