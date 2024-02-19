
const allPersons = document.getElementById("persons");
const personNames = Array.from(allPersons.options).map(option => option.value).slice(1);


const alertBox=document.querySelector(".custom-alert");        //------>>> alert box refrences
const alertHeading=document.querySelector(".custom-alert h2");



console.log(personNames);

const busyTimings = {
    "john": {
        "2024-02-19": ["10am", "11am", "1pm", "2pm"],
        "2024-02-20": ["5am", "9am", "7pm", "10pm"],
        "2024-02-21": ["6am", "11am", "12pm", "1pm"]
    },
    "alice": {
        "2024-02-19": ["10am", "11am", "3pm"],
        "2024-02-20": ["8am", "1pm", "3pm"],
        "2024-02-21": ["10am", "12pm", "2pm"]
    },
    "bob": {
        "2024-02-19": ["12pm", "1pm", "2pm"],
        "2024-02-20": ["4am", "6am", "8pm"],
        "2024-02-21": ["9am", "10am", "11am"]
    },
    "jack": {
        "2024-02-19": ["11pm", "5pm", "9pm"],
        "2024-02-20": ["7am", "11am", "4pm"],
        "2024-02-21": ["11am", "4pm", "6pm"]
    }
};



var allTasks = JSON.parse(localStorage.getItem("allTasks")) || [];
allTasks.forEach(task => displayTaskAsCard(task));

console.log(allTasks);

document.querySelector(".category").addEventListener("click", function(event) {


    const groups=document.querySelectorAll(".group1");

    if (event.target.tagName === "INPUT" && event.target.value === "remainders") {
        event.target.checked=true;
        document.getElementById("notes").checked=false;
        groups.forEach(group =>
            group.style.display="flex"
        );

    } else {
        groups.forEach(group =>
            group.style.display="none"
        );
    }
});

document.querySelector(".clear-form").addEventListener("click",function(){
    document.getElementById("myForm").reset();
});

document.querySelector(".clear-btn").addEventListener("click", function() {
    const taskList = document.querySelector(".display-box");
    taskList.innerHTML = "";
    localStorage.clear();
    allTasks=[];
    location.reset();
});

function displayAlertBox(str){
    alertHeading.innerHTML="";
        alertBox.style.display="block";
        alertBox.style.zIndex="1";
        // alertBox.style.boxShadow = "10px 20px 30px 5000px rgba(228, 228, 225, 0.5)";
        alertBox.style.boxShadow = "0 0 0 1000px rgba(0, 0, 0, .3)";
        alertHeading.innerHTML=str;
}


document.getElementById("myForm").addEventListener("submit", function(e) {
    e.preventDefault();

    const inputBox = document.querySelector(".task-title input");
    const textAreaa = document.querySelector(".task-description textarea");
    if (inputBox.value.trim() === "") {
        // const alertButton=document.querySelector(".custom-alert button");
        // alertHeading.innerHTML="";
        // alertBox.style.display="block";
        // alertBox.style.zIndex="1";
        // alertBox.style.boxShadow = "10px 20px 30px 5000px rgba(228, 228, 225, 0.5)";
        // alertHeading.innerHTML=`Title cant be blank...`;
        displayAlertBox("Title cant be blank...");
        return;

        // alert("Title cant be blank...");
    }

    if(inputBox.value.trim().length>25){
        displayAlertBox("Title cant be soo long...");
        // alert("Title cant be soo long...");
        return;
    }

    if (textAreaa.value.trim() === "") {
        displayAlertBox("Add description too...");
        // alert("Add description too...");
        return;
    }

    const formData = new FormData(this);
    const data = Object.fromEntries(formData);
    const category = data.category;

    console.log(data.date);

    if (!category) {
        alert("Select the category...");
        return;
    }

    if (category === "notes") {

        const task = {
            title: data.title,
            description: data.description,
            category: category,
            completed: false
        };

        allTasks.push(task);
        displayTaskAsCard(task);
    } else if (category === "remainders") {

        const persons = Array.from(formData.getAll("persons"));
        console.log(persons);


        if (!data.meeting) {
            displayAlertBox("Select the meeting type...");
            // alert("Select the meeting type...");
            return;
        }

        if (data.meeting == "personal" && persons.length == 0) {
            displayAlertBox("Select the person as well..");
            // alert("Select the person as well..");
            return;
        }

        if(data.meeting == "personal" && persons.length>1){
            displayAlertBox("Personal Meeting is for only person, select Group Meeting for multiple persons...");
            // alert("Personal Meeting is for only person, select Group Meeting for multiple persons...");
            return;
        }

        if (data.meeting == "group" && persons.length <= 1) {
            displayAlertBox("Select at least 2 persons...");
            // alert("Select at least 2 persons...");
            return;
        }

        if (!data.date) {
            displayAlertBox("Select the date...");
            // alert("Select the date...");
            return;
        }

        if (!data.time) {
            displayAlertBox("Select the time too..");
            // alert("Select the time too..");
            return;
        }
        if (!data["am-pm"]) {
            displayAlertBox("Select if its AM or PM");
            // alert("Select if its AM or PM");
            return;
        }

        const hour = data.time;
        const timeType=data["am-pm"];
        const timeTypeL = timeType.toLowerCase();
        const mergedTime=hour+""+timeTypeL;
        const dateS=data.date.toString();
        const arrayNames =  [];
        persons.forEach(person => {
            arrayNames.push(person.toLowerCase());
        });

        console.log(typeof mergedTime);



        let busyPeople=[];
        for(let i=0;i<persons.length;i++){
            
            let name=persons[i].toLowerCase();
            console.log(name);
            console.log(busyTimings[name].hasOwnProperty(dateS) && busyTimings[name][dateS].includes(mergedTime));

            console.log(mergedTime);
            if(busyTimings[name].hasOwnProperty(dateS) && busyTimings[name][dateS].includes(mergedTime)){
                busyPeople.push(persons[i]);
            }

        }
        console.log(persons);
        console.log(busyPeople);

        if(busyPeople.length>0){
            const busyName=busyPeople[0].toLowerCase();
            alert("Oops... "+busyPeople+" is busy at the selected time slot");
            const availabilityList=document.querySelector(".avail-list");
            availabilityList.innerHTML='';
            const ourBusyTimings=[];
            let personBusyTimings=[];
            if(persons.length==1){
                personBusyTimings=busyTimings[busyName][dateS];
            }
            else{
                for(let nam of persons){
                    console.log(nam);
                    console.log(busyTimings[nam.toLowerCase()]);
                    console.log(busyTimings[nam.toLowerCase()][dateS]);
                    personBusyTimings.push(busyTimings[nam.toLowerCase()][dateS]);
                }
                console.log(personBusyTimings);
                personBusyTimings=[...new Set(personBusyTimings.flat())]
                console.log(personBusyTimings);

            }
            allTasks.forEach(task=> {
                if(task.date===data.date){
                    const tempTime=task.time.split(" ");
                    const tempHours=parseInt(tempTime[0],10);
                    ourBusyTimings.push(tempHours+""+task.timeType.toLowerCase());
                }
            });
            console.log(ourBusyTimings);
            console.log(personBusyTimings);

            const allTimeSlots = [];
            for (let hour = 4; hour <= 11; hour++) {
                allTimeSlots.push(hour + "am");
            }
            for (let hour = 1; hour <= 10; hour++) {
                allTimeSlots.push(hour + "pm");
            }

            const excludedTimings = [...ourBusyTimings, ...personBusyTimings];

            const freeTimings = allTimeSlots.filter(timeSlot => !excludedTimings.includes(timeSlot));
            console.log("Free Timings:", freeTimings);

            const displayDiv=document.createElement("div");
            displayDiv.innerHTML=`<h3>Timings at ${persons} and you are free: </h3><br><p>${freeTimings.join(", ")}</p>`;
            availabilityList.appendChild(displayDiv);

            return;
        }

        const people=[];

        
        const overlappingTask = allTasks.find(task => {
            if (task.category === "remainders" && task.date === data.date) {
                
                const taskTimeParts = task.time.split(":");
                const taskHour = parseInt(taskTimeParts[0], 10);
                const tasktimeType = task.timeType;


                console.log(typeof taskHour);
                console.log(typeof hour);
                console.log(typeof timeType);
                console.log(typeof tasktimeType);

                console.log((taskHour == hour) && timeType===tasktimeType);
                
                if((taskHour == hour) && timeType===tasktimeType){
                    people.push(task.persons);
                }
                
                return (taskHour == hour) && timeType===tasktimeType;
            }
            return false;
        });

        console.log(overlappingTask);

        console.log(people);

        if (overlappingTask) {
            const allPeople=people.join(",");
            alert("Another meeting is already scheduled for the same time on this date for "+allPeople);
            return;
        }


        const task = {
            title: data.title,
            description: data.description,
            category: category,
            meeting: data.meeting,
            date: data.date,
            time: data.time + " " + data["am-pm"],
            timeType:data["am-pm"],
            persons: persons,
            completed: false
        };

        allTasks.push(task);
        displayTaskAsCard(task);
    }
    this.reset();
    storeTasks();
});



function storeTasks() {
    localStorage.setItem("allTasks", JSON.stringify(allTasks));
}


function displayTaskAsCard(task) {
    const card = document.createElement("li");
    card.classList.add("check");
    card.innerHTML = `
        <input type="checkbox">
        <div class="box-div">
            <h3>${task.title}</h3>
            <br>
            <p><b>Description : </b>${task.description}</p>
            ${task.category === "remainders" ? `
                    <p><b>Type : </b>${task.meeting} Meeting</p>
                    <p><b>Date: </b>${task.date}</p>
                    <p><b>Time: </b>${task.time}</p>
                    <p><b>Persons: </b>${task.persons.join(", ")}</p>
                ` : ''}
        </div>
        <span class="remove-task">❌</span>
    `;
    const checkbox = card.querySelector("input[type='checkbox']");
    checkbox.checked = task.completed;

    checkbox.addEventListener("change", function(event) {
        const taskIndex = Array.from(event.target.closest(".check").parentElement.children).indexOf(event.target.closest(".check"));
        allTasks[taskIndex].completed = event.target.checked;
        console.log(event.target.checked);
        if(event.target.checked){
            card.querySelector(".box-div").style.backgroundColor = "#ebffeb";
        }
        else{
            card.querySelector(".box-div").style.backgroundColor = "#dfdfff";
        }
        storeTasks();
    });
    
    if (task.completed) {
        card.querySelector(".box-div").style.backgroundColor = "#ebffeb";
    } else {
        card.querySelector(".box-div").style.backgroundColor = "#dfdfff";
    }
    document.querySelector(".display-box").appendChild(card);
}

document.querySelector(".display-box").addEventListener("click", function(event) {   // ----------------->>> when hit cross
    if (event.target.classList.contains("remove-task")) {
        const taskIndex = Array.from(event.target.closest(".check").parentElement.children).indexOf(event.target.closest(".check"));
        event.target.parentElement.remove();
        allTasks.splice(taskIndex,1);
        storeTasks();
    }
});


document.querySelector(".filters").addEventListener("click", function(event) {
    if (event.target.tagName === "SPAN") {
        document.querySelectorAll(".filters span").forEach(span => span.classList.remove("active"));
        event.target.classList.add("active");
        filterTasks(event.target.id);
    }
});

function filterTasks(filter) { //ok
    const tasks = document.querySelectorAll(".display-box li");
    tasks.forEach(task => {
        switch (filter) {
            case "upcoming":
                task.style.display = task.querySelector("input").checked ? "none" : "flex";
                break;
            case "completed":
                task.style.display = task.querySelector("input").checked ? "flex" : "none";
                break;
            default:
                task.style.display = "flex";
        }
    });
}



document.addEventListener("DOMContentLoaded", function() {
    const dtToday = new Date();
    const month = (dtToday.getMonth() + 1).toString().padStart(2, '0');
    const day = dtToday.getDate().toString().padStart(2, '0');
    const year = dtToday.getFullYear();

    const maxDate = `${year}-${month}-${day}`;

    const dateInput = document.getElementById('date');
    dateInput.setAttribute('min', maxDate);
});

// new changes here date :- 2/19/2023
document.querySelector(".meeting").addEventListener("click", function(event){
    if(event.target.value==="personal"){
        document.getElementById("persons").multiple=false;
    }
    else{
        document.getElementById("persons").multiple=true;
    }
});

document.querySelector(".alert-button").addEventListener("click",function(e){
    const alertBox=document.querySelector(".custom-alert");
    alertBox.style.display="none";
});


