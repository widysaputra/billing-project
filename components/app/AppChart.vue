<template>
    <div :class="containerClass" :style="chartStyle">
        <div v-if="validSeries.length === 0" class="flex items-center justify-center h-64 text-gray-500">
            <div class="text-center">
                <p>No data available</p>
                <p class="text-sm">Please provide series data</p>
            </div>
        </div>
        
        <div v-else ref="chartElement" class="w-full" :style="`min-height: ${props.height}px`"></div>
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch, computed, nextTick } from 'vue'

// Dynamic import ApexCharts untuk menghindari SSR issues
let ApexCharts = null

// Props
const props = defineProps({
    // Chart configuration
    type: {
        type: String,
        default: 'line',
        validator: (value) => ['line', 'bar', 'area', 'pie', 'donut', 'scatter', 'radialBar'].includes(value)
    },
    height: {
        type: Number,
        default: 350
    },
    // Data
    series: {
        type: Array,
        required: true
    },
    categories: {
        type: Array,
        default: () => []
    },
    
    // Styling
    colors: {
        type: Array,
        default: () => ['#008FFB', '#00E396', '#FEB019', '#FF4560', '#775DD0']
    },
    containerClass: {
        type: String,
        default: 'bg-white rounded-lg shadow-lg p-6 mb-6'
    },
    width: {
        type: String,
        default: '28rem'
    },
    // Chart options
    title: {
        type: String,
        default: ''
    },
    titleAlign: {
        type: String,
        default: 'center',
        validator: (value) => ['left', 'center', 'right'].includes(value)
    },
    curve: {
        type: String,
        default: 'straight',
        validator: (value) => ['smooth', 'straight', 'stepline'].includes(value)
    },
    
    // RadialBar specific props
    radialBarLabels: {
        type: Array,
        default: () => []
    },
    radialBarStartAngle: {
        type: Number,
        default: -180
    },
    radialBarEndAngle: {
        type: Number,
        default: 180
    },
    radialBarHollow: {
        type: String,
        default: '20%'
    },
    radialBarTrackColor: {
        type: String,
        default: '#f2f2f2'
    },
    
    // Features
    animations: {
        type: Boolean,
        default: true
    },
    showControls: {
        type: Boolean,
        default: false
    },
    showResetButton: {
        type: Boolean,
        default: true
    },
    
    // Advanced options
    customOptions: {
        type: Object,
        default: () => ({})
    }
})

// Emits
const emit = defineEmits(['chartReady', 'dataUpdated', 'chartReset'])

const chartStyle = computed(() => {
    return `width: ${props.width}; overflow: hidden`
})

// Refs
const chartElement = ref(null)
let chart = null

// Computed chart options
const chartOptions = computed(() => {
    const baseOptions = {
        chart: {
            type: props.type,
            height: props.height,
            animations: {
                enabled: props.animations
            }
        },
        toolbar: {
                show: true,
                tools: {
                    download: true,
                    selection: false,
                    zoom: false,
                    zoomin: false,
                    zoomout: false,
                    pan: false,
                    reset: false
                }
            },
        colors: props.colors,
        dataLabels: {
            enabled: false 
        }
    }

    // Tambahkan title jika ada
    if (props.title) {
        baseOptions.title = {
            text: props.title,
            align: props.titleAlign,
            style: {
                fontSize: '16px',
                fontWeight: 'bold'
            }
        }
    }

    // Tambahkan xaxis untuk chart yang membutuhkan categories
    if (props.categories.length > 0 && props.type !== 'radialBar') {
        baseOptions.xaxis = {
            categories: props.categories
        }
    }

    // Tambahkan stroke untuk line dan area charts
    if (['line', 'area'].includes(props.type)) {
        baseOptions.stroke = {
            curve: props.curve
        }
    }

    // Special configuration for radialBar
    if (props.type === 'radialBar') {
        // Untuk radialBar, jangan tambahkan xaxis
        baseOptions.plotOptions = {
            radialBar: {
                startAngle: props.radialBarStartAngle,
                endAngle: props.radialBarEndAngle,
                hollow: {
                    margin: 0,
                    size: props.radialBarHollow,
                    background: 'transparent'
                },
                track: {
                    background: props.radialBarTrackColor,
                    strokeWidth: '50%',
                    margin: 0
                },
                dataLabels: {
                    show: true,
                    name: {
                        offsetY: -10,
                        show: true,
                        color: '#888',
                        fontSize: '12px'
                    },
                    value: {
                        formatter: function(val) {
                            return parseInt(val) + '%'
                        },
                        color: '#111',
                        fontSize: '20px',
                        show: true,
                    }
                }
            }
        }
        
        // Labels untuk radialBar
        if (props.radialBarLabels.length > 0) {
            baseOptions.labels = props.radialBarLabels
        }
    }
    
    const result = mergeDeep(baseOptions, props.customOptions)
    result.chart.toolbar = { show: true }
    result.chart.zoom = { enabled: false }
    
    return result
})

// Deep merge function
function mergeDeep(target, source) {
    const output = Object.assign({}, target)
    if (isObject(target) && isObject(source)) {
        Object.keys(source).forEach(key => {
            if (isObject(source[key])) {
                if (!(key in target))
                    Object.assign(output, { [key]: source[key] })
                else
                    output[key] = mergeDeep(target[key], source[key])
            } else {
                Object.assign(output, { [key]: source[key] })
            }
        })
    }
    return output
}

function isObject(item) {
    return item && typeof item === 'object' && !Array.isArray(item)
}

const validSeries = computed(() => {
    // Pastikan props.series ada dan merupakan array
    if (!props.series || !Array.isArray(props.series)) {
        return []
    }
    
    // Untuk radialBar, series harus berupa array of numbers
    if (props.type === 'radialBar') {
        // Jika series berupa array of numbers, return as is
        if (props.series.every(item => typeof item === 'number')) {
            return props.series
        }
        // Jika series berupa array of objects, extract data
        if (props.series.every(item => item && typeof item === 'object' && item.data)) {
            return props.series.map(item => item.data).flat()
        }
        return []
    }
    
    // Untuk chart lainnya, pastikan setiap item memiliki struktur yang benar
    return props.series.filter(serie => 
        serie && 
        typeof serie === 'object' && 
        serie.name && 
        Array.isArray(serie.data)
    )
})

// Methods
const updateChart = (newData = null) => {
    if (!chart) return
    
    let dataToUpdate
    if (newData) {
        dataToUpdate = newData
    } else {
        // Generate random data for demo
        if (props.type === 'radialBar') {
            // For radialBar, generate array of numbers
            dataToUpdate = validSeries.value.map(() => Math.floor(Math.random() * 100) + 1)
        } else {
            dataToUpdate = validSeries.value.map(serie => ({
                ...serie,
                data: serie.data.map(() => Math.floor(Math.random() * 100) + 10)
            }))
        }
    }
    
    try {
        chart.updateSeries(dataToUpdate)
        emit('dataUpdated', dataToUpdate)
    } catch (error) {
        console.error('Error updating chart:', error)
    }
}

const resetChart = () => {
    if (!chart) return
    
    try {
        chart.updateSeries(validSeries.value)
        emit('chartReset', validSeries.value)
    } catch (error) {
        console.error('Error resetting chart:', error)
    }
}

const destroyChart = () => {
    if (chart) {
        chart.destroy()
        chart = null
    }
}

const renderChart = async () => {
    if (!ApexCharts) {
        try {
            const apexModule = await import('apexcharts')
            ApexCharts = apexModule.default
        } catch (error) {
            console.error('Failed to load ApexCharts:', error)
            return
        }
    }

    await nextTick()
    
    if (chartElement.value && !chart && ApexCharts) {
        try {
            // Validasi data sebelum render
            if (!validSeries.value || validSeries.value.length === 0) {
                console.warn('No valid series data provided')
                return
            }

            const options = {
                ...chartOptions.value,
                series: validSeries.value
            }

            // Debug log
            console.log('Chart type:', props.type)
            console.log('Valid series:', validSeries.value)
            console.log('Chart options:', options)

            chart = new ApexCharts(chartElement.value, options)
            await chart.render()
            emit('chartReady', chart)
        } catch (error) {
            console.error('Failed to render chart:', error)
            console.error('Chart type:', props.type)
            console.error('Valid series:', validSeries.value)
            console.error('Original series:', props.series)
        }
    }
}

// Watch for prop changes
watch(() => props.series, (newSeries) => {
    if (chart && newSeries && Array.isArray(newSeries) && newSeries.length > 0) {
        try {
            // Gunakan validSeries untuk memastikan format yang benar
            const processedSeries = props.type === 'radialBar' 
                ? (newSeries.every(item => typeof item === 'number') ? newSeries : [])
                : newSeries
            
            if (processedSeries.length > 0) {
                chart.updateSeries(processedSeries)
            }
        } catch (error) {
            console.error('Error updating series:', error)
        }
    }
}, { deep: true })

// Perbaiki watch untuk categories
watch(() => props.categories, (newCategories) => {
    if (chart && newCategories && Array.isArray(newCategories) && newCategories.length > 0 && props.type !== 'radialBar') {
        try {
            chart.updateOptions({
                xaxis: {
                    categories: newCategories
                }
            })
        } catch (error) {
            console.error('Error updating categories:', error)
        }
    }
})

// Lifecycle hooks
onMounted(() => {
    // Delay rendering untuk memastikan DOM sudah ready
    setTimeout(() => {
        renderChart()
    }, 100)
})

onBeforeUnmount(() => {
    destroyChart()
})

// Expose methods untuk parent component
defineExpose({
    updateChart,
    resetChart,
    chart: computed(() => chart)
})
</script>
