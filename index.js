// FETCHING THE COMPONENTS

fetch('skeleton/sidebar.html')
    .then(response => response.text())  
    .then(data => {
        
        document.getElementById("sidebar-component").innerHTML = data;
        
    })
    .catch(error => console.error('Error loading the sidebar:', error));

fetch('skeleton/middleComponent.html')
    .then(response => response.text())  
    .then(data => {
        
        document.getElementById("middle-component").innerHTML = data;
        initializeChart();
        
    })
    .catch(error => console.error('Error loading the middle component:', error));

fetch('skeleton/rightComponent.html')
    .then(response => response.text())  
    .then(data => {
        
        document.getElementById("right-component").innerHTML = data;
        
    })
    .catch(error => console.error('Error loading the right component:', error));

// RESPONSIVE SIDEBAR TO SWIPE

let touchStartX = 0;
let touchEndX = 0;

document.addEventListener("touchstart", (event) => {
    touchStartX = event.touches[0].clientX;
});

document.addEventListener("touchend", (event) => {
    touchEndX = event.changedTouches[0].clientX;
    handleSwipe();
});

function handleSwipe() {
    const sidebar = document.getElementById("sidebar");

    const swipeDistance = touchEndX - touchStartX;

    if (swipeDistance > 50) {
        openSidebar(); 
    } else if (swipeDistance < -50) {
        closeSidebar(); 
    }
}

function openSidebar() {
    const sidebar = document.getElementById("sidebar");
    sidebar.classList.remove("-translate-x-full");
}

function closeSidebar() {
    const sidebar = document.getElementById("sidebar");
    sidebar.classList.add("-translate-x-full");
}


// USING CHART JS FOR THE CHART
function initializeChart() {
    let canvas = document.getElementById("myChart");
    let timeFilter = document.getElementById("timeFilter");

    if (!canvas || !timeFilter) {
        console.error("Canvas or dropdown not found. Check your HTML structure.");
        return;
    }

    const ctx = canvas.getContext("2d");
    let myChart;

    async function fetchChartData(selection) {
        try {
            const response = await fetch(`data/${selection}.json`);
            return await response.json();
        } catch (error) {
            console.error("Error fetching data:", error);
            return [];
        }
    }

    function updateChart(newData) {
        if (myChart) myChart.destroy();

        myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: newData.map(item => item.period),
                datasets: [
                    {
                        label: 'Label 1',
                        borderColor: '#3B82F6',
                        backgroundColor: 'rgba(59, 130, 246, 0.2)',
                        data: newData.map(item => item.label1),
                        fill: true
                    },
                    {
                        label: 'Label 2',
                        borderColor: '#F59E0B',
                        backgroundColor: 'rgba(245, 158, 11, 0.2)',
                        data: newData.map(item => item.label2),
                        fill: true
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false, 
                scales: {
                    y: { beginAtZero: true },
                    x: { title: { display: true, text: 'Day' } }
                }
            }
        });

        
        resizeCanvas();
    }

    function resizeCanvas() {
        setTimeout(() => {
            
            canvas.style.width = "100%";
            canvas.style.height = "400px";
            if (myChart) myChart.resize();
        }, 200); 
    }

    
    fetchChartData("weekly").then(updateChart);

    
    timeFilter.addEventListener("change", async function () {
        const newData = await fetchChartData(this.value);
        updateChart(newData);
    });

    window.addEventListener("resize", resizeCanvas);
}


