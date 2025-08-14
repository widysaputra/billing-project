<template>
    <div class="flex gap-6 justify-start mt-5">
        <div class="flex-1">
            <AppCard
                cardClass="bg-gradient-to-r from-sky-800 to-teal-600 transition delay-50 duration-100 ease-in-out hover:-translate-y-1 hover:scale-110 text-white"
                title="Pendapatan"
                headerImage="https://primefaces.org/cdn/primevue/images/usercard.png"
                headerImageAlt="Jumlah Pendapatan"
                content="This is user profile information content."
                :show-default-footer="true"
                save-label="Update"
            />
        </div>
        <div class="flex-1">
            <AppCard
                cardClass="bg-gradient-to-r from-sky-800 to-teal-600 transition delay-50 duration-100 ease-in-out hover:-translate-y-1 hover:scale-110 text-white"
                title="Pengeluaran"
                headerImage="https://primefaces.org/cdn/primevue/images/usercard.png"
                headerImageAlt="Jumlah Pengeluaran"
                content="This is user profile information content."
                :show-default-footer="true"
                save-label="Update"
            />
        </div>
        <div class="flex-1">
            <AppCard
                cardClass="bg-gradient-to-r from-sky-800 to-teal-600 transition delay-50 duration-100 ease-in-out hover:-translate-y-1 hover:scale-110 text-white"
                title="Penerimaan"
                headerImage="https://primefaces.org/cdn/primevue/images/usercard.png"
                headerImageAlt="Jumlah Pengeluaran"
                content="This is user profile information content."
                :show-default-footer="true"
                save-label="Update"
            />
        </div>
    </div>
    
    <div class="flex gap-6 justify-start mt-5">
        <div class="flex-1">
            <AppChart
                v-if="salesSeries && salesSeries.length > 0"
                type="line"
                title="Monthly Sales Data"
                :series="salesSeries"
                :categories="months"
                :show-toolbar="false"
                @data-updated="handleDataUpdate"
                @chart-ready="onChartReady"
            />
        </div>
        <div class="flex-1">
            <AppChart
                v-if="areaSeries && areaSeries.length > 0"
                type="area"
                title="Monthly Sales & Revenue Data"
                :series="areaSeries"
                :show-controls="true"
                :custom-options="areaOptions"
                :colors="['#39539E', '#09e8ca']"
                @data-updated="handleAreaDataUpdate"
                @chart-ready="onAreaChartReady"
            />
        </div>
        <div class="flex-1">
            <AppChart
                type="radialBar"
                title="Performance Metrics"
                :series="performanceData"
                :radial-bar-labels="performanceLabels"
                :colors="['#1ab7ea', '#0084ff', '#39539E', '#0077B5']"
                :height="360"
                :show-controls="true"
                :custom-options="radialBarOptions"
            />
        </div>
    </div>
     <div class="flex gap-6 justify-start mt-5">
        <div class="flex-1">
            <AppChart
                v-if="pieSeries && pieSeries.length > 0"
                type="pie"
                title="Pie Chart Example"
                :series="pieSeries"
                :categories="months"
                :show-toolbar="false"
                @data-updated="handleDataUpdate"
                @chart-ready="onChartReady"
            />
        </div>
     </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// Reactive data
const salesSeries = ref([])
const months = ref(['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'])
const areaSeries = ref([])
const pieSeries = ref([])

const performanceData = ref([76, 21, 5])
const performanceLabels = ['Sales','Revenue','Loss']

const radialBarOptions = {
    plotOptions: {
        radialBar: {
            offsetY: 0,
            startAngle: 0,
            endAngle: 270,
            hollow: {
                margin: 5,
                size: '30%',
                background: 'transparent',
            },
            dataLabels: {
                name: {
                    show: true,
                    fontSize: '16px',
                    fontWeight: 600,
                    offsetY: -10
                },
                value: {
                    show: true,
                    fontSize: '14px',
                    fontWeight: 400,
                    offsetY: 16,
                    formatter: function (val) {
                        return val + "%"
                    }
                }
            }
        }
    },
    fill: {
        type: 'gradient',
        gradient: {
            shade: 'dark',
            type: 'horizontal',
            shadeIntensity: 0.5,
            gradientToColors: ['#ABE5A1'],
            inverseColors: true,
            opacityFrom: 1,
            opacityTo: 1,
            stops: [0, 100]
        }
    },
    legend: {
        show: true,
        floating: true,
        fontSize: '16px',
        position: 'left',
        offsetX: 50,
        offsetY: 10,
        labels: {
            useSeriesColors: true,
        },
        formatter: function(seriesName, opts) {
            return seriesName + ":  " + opts.w.globals.series[opts.seriesIndex] + "%"
        },
        itemMargin: {
            horizontal: 3,
        }
    },
    responsive: [{
        breakpoint: 480,
        options: {
            legend: {
                show: false
            }
        }
    }]
}

const areaOptions = ref({ 
    chart: {
        toolbar: { show: false },
        zoom: { enabled: false }
    },
    fill: {
        type: ['gradient','gradient'],
        gradient: {
            shade: ['light','light'],
            type: 'vertical',
            shadeIntensity: 0.4,
            opacityFrom: 0.7,
            opacityTo: 0.1,
            stops: [0, 100]
        }
    },
    stroke: {
        show: true,
        curve: ['straight', 'straight'],
        lineCap: 'butt',
        colors: undefined,
        width: 2,
        dashArray: 1, 
    },
    dataLabels: {
        enabled: false
    },
    markers: {
        size: 0,
        hover: {
            size: 6,
            strokeWidth: 2
        }
    },
    xaxis: {
        show: false
    },
    yaxis: {
        show: false
    },
    grid: {
        borderColor: '#f1f1f1',
        strokeDashArray: 3
    },
    tooltip: {
        theme: 'light',
        x: {
            format: 'dd/mm/yy HH:mm'
        }
    },
    legend: { 
        position: 'top',
        horizontalAlign: 'left',
        // labels: {
        //     colors: ['#56ab2f', '#fd746c']
        // }
    }
})

// Initialize data setelah component mounted
onMounted(() => {
    salesSeries.value = [{
        name: 'Sales',
        data: [30, 40, 35, 50, 49, 60, 70, 91, 125]
    }]

    pieSeries.value = [{
        name: 'Sales',
        data: [30, 40, 35, 50, 49, 60, 70, 91, 125]
    }]
    
    areaSeries.value = [
        {
            name: 'Sales',
            data: [30, 40, 60, 50, 49, 60, 40, 65, 50, 60, 40, 75, 40, 39, 50, 40, 71, 59],
        },
        {
            name: 'Revenue',
            data: [60, 40, 75, 40, 39, 50, 40, 71, 59, 30, 40, 60, 50, 49, 60, 70, 75, 50]
        }
    ]

})



const handleAreaDataUpdate = (newData) => {
    console.log('Chart updated with:', newData)
}

const onAreaChartReady = (chart) => {
    console.log('Chart is ready:', chart)
}

const handleDataUpdate = (newData) => {
    console.log('Chart updated with:', newData)
}

const onChartReady = (chart) => {
    console.log('Chart is ready:', chart)
}
</script>
