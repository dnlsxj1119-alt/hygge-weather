import React, { useEffect, useMemo, useState } from 'react';
import {
  Bike,
  BookOpen,
  Building2,
  CloudRain,
  Coffee,
  Compass,
  Droplets,
  IceCreamBowl,
  LoaderCircle,
  MapPin,
  Soup,
  Sun,
  Thermometer,
  Trees,
  Umbrella,
  Waves,
  Wind,
} from 'lucide-react';

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

const CITIES = [
  { name: 'Copenhagen', label: 'Copenhagen', country: 'DK' },
  { name: 'Aarhus', label: 'Aarhus', country: 'DK' },
  { name: 'Odense', label: 'Odense', country: 'DK' },
  { name: 'Aalborg', label: 'Aalborg', country: 'DK' },
  { name: 'Roskilde', label: 'Roskilde', country: 'DK' },
  { name: 'Lyngby', label: 'Lyngby', country: 'DK' },
];

const HYGGE_LINES = [
  'Today is perfect for a cozy hygge moment.',
  'Let the weather choose a softer rhythm for your day.',
  'A warm drink, a small plan, and a very Danish kind of calm.',
  'Make room for one simple pleasure before the day ends.',
];

const RECOMMENDATION_SETS = {
  rain: {
    title: '비 오는 날의 휘게',
    tone: 'Stay dry, warm, and unhurried.',
    items: [
      { icon: Coffee, title: '실내 카페', text: '창가 자리에 앉아 커피와 시나몬 번을 즐겨보세요.' },
      { icon: Building2, title: '디자인 뮤지엄', text: 'Designmuseum Denmark처럼 비 오는 날 오래 머물기 좋은 공간을 추천해요.' },
      { icon: Coffee, title: '따뜻한 라떼', text: '우산을 접고 들어가 따뜻한 라떼 한 잔으로 속도를 낮춰보세요.' },
    ],
    food: { icon: Coffee, title: '오늘의 음식', text: '따뜻한 라떼와 시나몬 번' },
  },
  clear: {
    title: '햇살 좋은 하루',
    tone: 'Go outside while the light is kind.',
    items: [
      { icon: Waves, title: 'Nyhavn 산책', text: '항구의 색감과 물가 바람을 천천히 즐겨보세요.' },
      { icon: Bike, title: '자전거 라이딩', text: '도시의 자전거 길을 따라 가볍게 움직이기 좋습니다.' },
      { icon: Trees, title: '공원 피크닉', text: 'King’s Garden이나 Frederiksberg Have에서 여유를 만들어보세요.' },
    ],
    food: { icon: Coffee, title: '오늘의 음식', text: '오픈 샌드위치와 아이스 커피' },
  },
  cold: {
    title: '추운 날의 온기',
    tone: 'Choose warmth first, then choose the view.',
    items: [
      { icon: Coffee, title: '따뜻한 음료', text: '핫초코나 라떼처럼 손을 데울 수 있는 음료로 시작하세요.' },
      { icon: Building2, title: '실내 관광', text: '추운 날에는 전시, 성 내부 투어, 디자인 공간처럼 실내 코스가 좋습니다.' },
      { icon: BookOpen, title: '조용한 카페', text: '긴 코트 그대로 들어가 천천히 머물 수 있는 곳을 골라보세요.' },
    ],
    food: { icon: Soup, title: '오늘의 음식', text: '크리미한 감자 수프' },
  },
  wind: {
    title: '바람 강한 날',
    tone: 'Keep the plan close and comfortable.',
    items: [
      { icon: Compass, title: '대중교통 추천', text: '풍속이 강한 날은 자전거보다 지하철이나 버스로 이동해보세요.' },
      { icon: Building2, title: '실내 활동', text: '야외 일정을 줄이고 전시, 영화관, 실내 카페 위주로 계획하세요.' },
      { icon: Coffee, title: '가까운 카페', text: '긴 이동보다 숙소나 역 근처의 따뜻한 공간이 잘 어울립니다.' },
    ],
    food: { icon: Soup, title: '오늘의 음식', text: '따뜻한 스튜와 허브티' },
  },
  snow: {
    title: '눈 오는 덴마크',
    tone: 'Soft light, slow steps, warm hands.',
    items: [
      { icon: BookOpen, title: '실내 서점', text: '눈 오는 날에는 책방에서 천천히 머무는 시간이 잘 어울립니다.' },
      { icon: Coffee, title: '핫초코', text: '진한 핫초코로 손끝부터 따뜻하게 녹여보세요.' },
      { icon: Building2, title: '조용한 카페', text: '낮은 조명과 편안한 좌석이 있는 카페를 추천해요.' },
    ],
    food: { icon: Coffee, title: '오늘의 음식', text: '핫초코와 버터 쿠키' },
  },
  clouds: {
    title: '흐린 날의 균형',
    tone: 'A gentle plan works best.',
    items: [
      { icon: Coffee, title: '브런치 카페', text: '느긋한 식사와 커피로 하루의 속도를 낮춰보세요.' },
      { icon: Building2, title: '디자인 숍', text: '덴마크 디자인 소품을 구경하기 좋은 날입니다.' },
      { icon: Trees, title: '짧은 공원 산책', text: '비가 오기 전 가까운 녹지에서 숨을 돌려보세요.' },
    ],
    food: { icon: Coffee, title: '오늘의 음식', text: '카넬스네일과 라떼' },
  },
  hot: {
    title: '따뜻한 북유럽 햇살',
    tone: 'Keep it bright, breezy, and close to the water.',
    items: [
      { icon: Waves, title: '항구 산책', text: '물가를 따라 걸으며 덴마크의 긴 낮을 느껴보세요.' },
      { icon: IceCreamBowl, title: '아이스커피', text: '카페 테라스에서 차가운 커피 한 잔을 곁들이기 좋은 날입니다.' },
      { icon: Trees, title: '야외 피크닉', text: '그늘이 있는 공원에서 가볍게 쉬어가세요.' },
    ],
    food: { icon: Coffee, title: '오늘의 음식', text: '아이스커피와 오픈 샌드위치' },
  },
};

function getWeatherKind(weather) {
  const main = weather?.weather?.[0]?.main?.toLowerCase() ?? '';
  const temp = weather?.main?.temp;
  const windSpeed = weather?.wind?.speed;

  if (main.includes('snow')) return 'snow';
  if (main.includes('rain') || main.includes('drizzle') || main.includes('thunderstorm')) return 'rain';
  if (windSpeed >= 8) return 'wind';
  if (temp <= 5) return 'cold';
  if (temp >= 23) return 'hot';
  if (main.includes('clear')) return 'clear';
  if (main.includes('cloud')) return 'clouds';
  return 'clouds';
}

function getBackground(kind) {
  const backgrounds = {
    clear: 'from-[#f6ead7] via-[#f9f3e7] to-[#dcefcf]',
    rain: 'from-[#1f2937] via-[#334155] to-[#64748b]',
    snow: 'from-[#f8fafc] via-[#eef6f8] to-[#d8e5ea]',
    cold: 'from-[#dfeaf2] via-[#f8fafc] to-[#d7dde8]',
    wind: 'from-[#d8e2df] via-[#eef1ec] to-[#cbd5d1]',
    hot: 'from-[#f5dfbf] via-[#f8efd8] to-[#c7e2db]',
    clouds: 'from-[#d9ddd4] via-[#f1eee7] to-[#cad3d4]',
  };
  return backgrounds[kind] ?? backgrounds.clouds;
}

function formatWeatherError(error) {
  if (error.message === 'missing-key') {
    return 'OpenWeather API 키가 설정되지 않았습니다. .env 파일에 VITE_OPENWEATHER_API_KEY를 추가해주세요.';
  }
  return '날씨 정보를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.';
}

async function fetchWeather(cityName, signal) {
  if (!API_KEY) {
    throw new Error('missing-key');
  }

  const url = new URL('https://api.openweathermap.org/data/2.5/weather');
  url.searchParams.set('q', `${cityName},DK`);
  url.searchParams.set('appid', API_KEY);
  url.searchParams.set('units', 'metric');
  url.searchParams.set('lang', 'kr');

  const response = await fetch(url, { signal });
  if (!response.ok) {
    throw new Error('api-error');
  }

  const data = await response.json();
  if (!data?.weather?.length || !data?.main || !data?.wind) {
    throw new Error('invalid-data');
  }
  return data;
}

function Stat({ icon: Icon, label, value }) {
  return (
    <div className="stat-tile">
      <Icon className="h-5 w-5" aria-hidden="true" />
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function RecommendationCard({ item }) {
  const Icon = item.icon;
  return (
    <article className="recommendation-card">
      <div className="icon-badge">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </div>
      <div>
        <h3>{item.title}</h3>
        <p>{item.text}</p>
      </div>
    </article>
  );
}

export default function App() {
  const [selectedCity, setSelectedCity] = useState(CITIES[0].name);
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isActive = true;
    const controller = new AbortController();

    async function loadWeather() {
      setIsLoading(true);
      setError('');

      try {
        const data = await fetchWeather(selectedCity, controller.signal);
        if (isActive) {
          setWeather(data);
        }
      } catch (currentError) {
        if (currentError.name === 'AbortError') return;
        if (!isActive) return;
        setError(formatWeatherError(currentError));
        setWeather(null);
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    loadWeather();
    return () => {
      isActive = false;
      controller.abort();
    };
  }, [selectedCity]);

  const kind = getWeatherKind(weather);
  const recommendations = RECOMMENDATION_SETS[kind];
  const FoodIcon = recommendations.food.icon;
  const hyggeLine = useMemo(() => {
    const cityIndex = CITIES.findIndex((city) => city.name === selectedCity);
    return HYGGE_LINES[Math.max(cityIndex, 0) % HYGGE_LINES.length];
  }, [selectedCity]);

  const weatherIcon = weather?.weather?.[0]?.icon;
  const weatherMain = weather?.weather?.[0]?.main ?? 'Weather';
  const weatherDescription = weather?.weather?.[0]?.description ?? '날씨 데이터 없음';

  return (
    <main className={`min-h-screen bg-gradient-to-br ${getBackground(kind)} px-5 py-6 text-slate-900 transition-colors duration-500 sm:px-8 lg:px-12`}>
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-7xl flex-col">
        <header className="flex flex-col gap-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="eyebrow">Denmark weather lifestyle</p>
            <h1 className="mt-2 text-4xl font-semibold leading-snug tracking-normal text-balance sm:text-6xl">
              Hygge Weather
            </h1>
          </div>

          <label className="city-picker">
            <MapPin className="h-5 w-5" aria-hidden="true" />
            <span className="sr-only">도시 선택</span>
            <select value={selectedCity} onChange={(event) => setSelectedCity(event.target.value)}>
              {CITIES.map((city) => (
                <option key={city.name} value={city.name}>
                  {city.label}
                </option>
              ))}
            </select>
          </label>
        </header>

        <section className="grid flex-1 items-center gap-6 pb-8 pt-2 lg:grid-cols-[1.02fr_0.98fr]">
          <div className="space-y-6">
            <div className="max-w-2xl">
              <p className="text-lg leading-8 text-slate-800 sm:text-xl">
                Hygge Weather는 덴마크의 실시간 날씨를 기반으로 오늘 가장 어울리는 활동과 장소를 추천하는 서비스입니다.
              </p>
              <p className="mt-4 text-2xl font-medium text-slate-950 sm:text-3xl">{hyggeLine}</p>
            </div>

            <section className="weather-panel" aria-label="현재 날씨">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="eyebrow">Live weather</p>
                  <h2 className="mt-2 text-3xl font-semibold">{weather?.name ?? selectedCity}</h2>
                  <p className="mt-1 capitalize text-slate-600">
                    {isLoading ? '덴마크 날씨를 불러오는 중...' : weatherDescription}
                  </p>
                </div>

                <div className="weather-mark">
                  {isLoading ? (
                    <LoaderCircle className="h-14 w-14 animate-spin" aria-label="날씨 불러오는 중" />
                  ) : weatherIcon ? (
                    <img
                      src={`https://openweathermap.org/img/wn/${weatherIcon}@2x.png`}
                      alt={weatherMain}
                      className="h-20 w-20"
                    />
                  ) : (
                    <CloudRain className="h-14 w-14" aria-hidden="true" />
                  )}
                </div>
              </div>

              {error ? <p className="alert-message">{error}</p> : null}

              <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <Stat icon={Thermometer} label="현재 온도" value={weather ? `${Math.round(weather.main.temp)}°C` : '--'} />
                <Stat icon={Sun} label="체감 온도" value={weather ? `${Math.round(weather.main.feels_like)}°C` : '--'} />
                <Stat icon={Droplets} label="습도" value={weather ? `${weather.main.humidity}%` : '--'} />
                <Stat icon={Wind} label="풍속" value={weather ? `${weather.wind.speed.toFixed(1)} m/s` : '--'} />
              </div>
            </section>
          </div>

          <section className="recommendation-panel" aria-label="날씨 기반 추천">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="eyebrow">Today’s plan</p>
                <h2>{recommendations.title}</h2>
                <p>{recommendations.tone}</p>
              </div>
              <Umbrella className="mt-1 h-8 w-8 shrink-0 text-slate-700" aria-hidden="true" />
            </div>

            <div className="mt-6 grid gap-4">
              {recommendations.items.map((item) => (
                <RecommendationCard key={item.title} item={item} />
              ))}
            </div>

            <article className="food-card">
              <div className="icon-badge dark">
                <FoodIcon className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <h3>{recommendations.food.title}</h3>
                <p>{recommendations.food.text}</p>
              </div>
            </article>
          </section>
        </section>
      </div>
    </main>
  );
}
