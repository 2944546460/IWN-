// src/mock/weatherData.ts

export interface MeteoNoFlyZone {
  id: string;
  name: string;
  level: 'RED' | 'ORANGE' | 'YELLOW';
  coordinates: [number, number][]; // Leaflet LatLng Polygon coordinates
  effectiveTimeRange: [number, number]; // [hourOffsetStart, hourOffsetEnd], e.g., [2, 8]
  restrictedUavTypes: string[]; // ['DJI', 'Mavlink_FixedWing', 'ALL']
  reason: string;
}

export interface WeatherGridDatum {
  id: string;
  lat: number;
  lng: number;
  size: number; // Roughly the degrees width/height of the grid box
  temperature: number; // Celsius
  precipitation: number; // mm/h
  windSpeed: number; // m/s
  timeOffset: number; // Hour offset from now: 0, 3, 6 ... 24
}

// ========================
// 1. 气象禁飞区假数据生成
// ========================
export const mockNoFlyZones: MeteoNoFlyZone[] = [
  {
    id: 'NFZ-WEATHER-001',
    name: 'G56 杭瑞高速廊道(西延段) 强对流红区',
    level: 'RED',
    coordinates: [
      [30.25, 119.80],
      [30.22, 119.80],
      [30.22, 119.60],
      [30.25, 119.60]
    ],
    effectiveTimeRange: [2, 6], // 未来第2小时到第6小时生效
    restrictedUavTypes: ['ALL'], // 红区属于极端天气，所有机型全线禁飞
    reason: '强对流预警：极度雷暴大风已切断该廊道段，全线禁飞'
  },
  {
    id: 'NFZ-WEATHER-002',
    name: 'G25 长深高速廊道(富春江段) 横风橙区',
    level: 'ORANGE',
    coordinates: [
      [30.00, 119.95],
      [29.85, 119.80],
      [29.83, 119.85],
      [29.98, 120.00]
    ],
    effectiveTimeRange: [0, 24], // 全天候生效
    restrictedUavTypes: ['DJI', 'FixedWing_Light', 'Micro_Quadcopter'], 
    reason: '山谷过境强横风：峡谷风扰流截断航线，仅限重工业机'
  },
  {
    id: 'NFZ-WEATHER-003',
    name: 'S14 杭长高速廊道(径山段) 降雨黄区',
    level: 'YELLOW',
    coordinates: [
      [30.41, 119.95],
      [30.46, 119.85],
      [30.48, 119.87],
      [30.43, 119.97]
    ],
    effectiveTimeRange: [6, 12], 
    restrictedUavTypes: ['Micro_Quadcopter'], 
    reason: '局地中雨：弱视距影响，禁飞无防护微型旋翼机'
  }
];


// ========================
// 2. 网格化气象假数据生成
// ========================
const centerLat = 30.2;
const centerLng = 119.9;
const gridSize = 0.08; // 约 8km 步长
const gridCols = 6;
const gridRows = 6;
const timeOffsets = [0, 3, 6, 9, 12, 15, 18, 21, 24];

function generateWeatherGrids(): WeatherGridDatum[] {
  const data: WeatherGridDatum[] = [];
  
  timeOffsets.forEach(timeOffset => {
    // 模拟一场自西向东的降水过程：
    // offset 0 时降水在西部边界，offset 6 时到达中心，offset 12 时东移衰减
    const stormCenterLng = 119.6 + (timeOffset * 0.05); 

    for (let i = 0; i < gridRows; i++) {
      for (let j = 0; j < gridCols; j++) {
        const lat = centerLat + (i - gridRows / 2) * gridSize;
        const lng = centerLng + (j - gridCols / 2) * gridSize;
        
        // 根据距离风暴中心的距离计算降水概率和雨量
        const distToStorm = Math.sqrt(Math.pow(lat - 30.2, 2) + Math.pow(lng - stormCenterLng, 2));
        
        let rain = 0;
        let wind = Math.random() * 5 + 2; // 默认 2 - 7 m/s
        let temp = 28 - (Math.random() * 3); // 默认 25 - 28 C
        
        if (distToStorm < 0.15) {
          // 风暴核心圈
          rain = 20 + Math.random() * 30; // 20 - 50 mm/h 暴雪/暴雨级别
          wind = 10 + Math.random() * 8;  // 大风
          temp -= 5; // 降温
        } else if (distToStorm < 0.3) {
          // 边缘圈
          rain = 5 + Math.random() * 10;
          wind = 6 + Math.random() * 5;
        }

        // 添加日夜温差动态
        if (timeOffset >= 12 && timeOffset <= 20) {
           temp -= 4; // 模拟夜晚降温
        }

        data.push({
          id: `w_grid_${timeOffset}_${i}_${j}`,
          lat,
          lng,
          size: gridSize,
          temperature: parseFloat(temp.toFixed(1)),
          precipitation: parseFloat(rain.toFixed(1)),
          windSpeed: parseFloat(wind.toFixed(1)),
          timeOffset
        });
      }
    }
  });
  
  return data;
}

export const mockWeatherGrids = generateWeatherGrids();
