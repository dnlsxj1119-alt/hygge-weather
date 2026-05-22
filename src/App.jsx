import React, { useEffect, useMemo, useState } from 'react';
import {
  Building2,
  CloudRain,
  Coffee,
  Compass,
  Droplets,
  LoaderCircle,
  MapPin,
  Soup,
  Sun,
  Thermometer,
  Umbrella,
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

const CITY_PLACES = {
  Copenhagen: {
    cafe: {
      name: 'Democratic Coffee',
      description: 'A beloved central Copenhagen cafe known for coffee and almond croissants.',
    },
    shop: {
      name: 'Illums Bolighus',
      description: 'A classic Danish design store for furniture, lighting, and home objects.',
    },
    walk: {
      name: 'Nyhavn',
      description: 'Colorful harbor houses, canal views, and an easy Copenhagen stroll.',
    },
    museum: {
      name: 'Designmuseum Denmark',
      description: 'A calm museum for Danish design, craft, furniture, and visual culture.',
    },
    food: {
      name: 'Kanelsnegl and latte',
      description: 'A sweet cinnamon pastry with a warm latte for a proper hygge pause.',
    },
  },
  Aarhus: {
    cafe: {
      name: 'La Cabra Coffee',
      description: 'A specialty coffee spot with bright roasts and a relaxed Aarhus rhythm.',
    },
    shop: {
      name: 'Salling',
      description: 'A central department store with shopping, food, and city views nearby.',
    },
    walk: {
      name: 'Latin Quarter',
      description: 'A charming old neighborhood with small streets, shops, and cafes.',
    },
    museum: {
      name: 'ARoS Aarhus Art Museum',
      description: 'A landmark art museum famous for bold exhibitions and the rainbow panorama.',
    },
    food: {
      name: 'Danish pastry and coffee',
      description: 'A simple pairing that fits a slow morning or rainy afternoon.',
    },
  },
  Odense: {
    cafe: {
      name: "Nelle's Coffee & Wine",
      description: 'A cozy Odense cafe for coffee by day and an easy glass of wine later.',
    },
    shop: {
      name: 'Brandts Klædefabrik',
      description: 'A former textile factory district now filled with culture, shops, and cafes.',
    },
    walk: {
      name: 'Munke Mose',
      description: 'A green riverside park for a gentle walk close to the city center.',
    },
    museum: {
      name: 'H.C. Andersen House',
      description: 'An atmospheric museum exploring the world of Denmark’s famous storyteller.',
    },
    food: {
      name: 'Hot chocolate and pastry',
      description: 'A warm, sweet stop that suits Odense’s fairytale mood.',
    },
  },
  Aalborg: {
    cafe: {
      name: 'Penny Lane Café',
      description: 'A warm cafe and bakery with a homely Aalborg feel.',
    },
    shop: {
      name: 'Friis Shoppingcenter',
      description: 'A convenient indoor shopping center near Aalborg’s central streets.',
    },
    walk: {
      name: 'Aalborg Waterfront',
      description: 'A modern harborfront walk with open views across the Limfjord.',
    },
    museum: {
      name: 'Kunsten Museum of Modern Art Aalborg',
      description: 'A striking modern art museum with architecture worth lingering over.',
    },
    food: {
      name: 'Warm soup and bread',
      description: 'A comforting choice after a windy walk along the waterfront.',
    },
  },
  Roskilde: {
    cafe: {
      name: 'Kaffekilden',
      description: 'A friendly coffee stop for a slower Roskilde morning.',
    },
    shop: {
      name: "RO's Torv",
      description: 'A practical shopping center with plenty of indoor options.',
    },
    walk: {
      name: 'Roskilde Harbour',
      description: 'A peaceful harbor area with fjord air and maritime views.',
    },
    museum: {
      name: 'Viking Ship Museum',
      description: 'A waterfront museum where Viking history meets boatbuilding craft.',
    },
    food: {
      name: 'Coffee and cinnamon roll',
      description: 'A classic cozy pairing before or after a harbor walk.',
    },
  },
  Lyngby: {
    cafe: {
      name: 'Café Mig og Annie',
      description: 'A relaxed local cafe for coffee, brunch, and an unhurried break.',
    },
    shop: {
      name: 'Lyngby Storcenter',
      description: 'A large indoor shopping center with easy access from central Lyngby.',
    },
    walk: {
      name: 'Lyngby Lake',
      description: 'A scenic lakeside walk with quiet water, trees, and fresh air.',
    },
    museum: {
      name: 'Frilandsmuseet',
      description: 'An open-air museum of historic Danish homes and rural life.',
    },
    food: {
      name: 'Latte and bakery',
      description: 'A soft cafe pairing for a calm Lyngby afternoon.',
    },
  },
};

const CATEGORY_LABELS = {
  cafe: 'Cafe',
  shop: 'Shop',
  walk: 'Walk',
  museum: 'Museum',
  food: 'Food',
  tip: 'Wind tip',
};

const CATEGORY_ICONS = {
  cafe: Coffee,
  shop: Building2,
  walk: MapPin,
  museum: Building2,
  food: Soup,
  tip: Compass,
};

const WEATHER_PROFILES = {
  rain: {
    title: '비 오는 날의 휘게',
    tone: 'Stay dry, warm, and unhurried.',
    categories: ['cafe', 'museum', 'shop', 'food'],
  },
  clear: {
    title: '햇살 좋은 하루',
    tone: 'Go outside while the light is kind.',
    categories: ['walk', 'cafe', 'shop', 'food'],
  },
  cold: {
    title: '추운 날의 온기',
    tone: 'Choose warmth first, then choose the view.',
    categories: ['cafe', 'museum', 'food', 'shop'],
  },
  wind: {
    title: '바람 강한 날',
    tone: 'Keep the plan close and comfortable.',
    categories: ['cafe', 'museum', 'shop', 'food'],
  },
  snow: {
    title: '눈 오는 덴마크',
    tone: 'Soft light, slow steps, warm hands.',
    categories: ['cafe', 'museum', 'food', 'shop'],
  },
  clouds: {
    title: '흐린 날의 균형',
    tone: 'A gentle plan works best.',
    categories: ['cafe', 'shop', 'walk', 'food'],
  },
  hot: {
    title: '따뜻한 북유럽 햇살',
    tone: 'Keep it bright, breezy, and close to the water.',
    categories: ['walk', 'cafe', 'shop', 'food'],
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

function getRecommendationKind(weather) {
  const main = weather?.weather?.[0]?.main?.toLowerCase() ?? '';
  const temp = weather?.main?.temp;

  if (main.includes('snow')) return 'snow';
  if (main.includes('rain') || main.includes('drizzle') || main.includes('thunderstorm')) return 'rain';
  if (temp <= 5) return 'cold';
  if (temp >= 23) return 'hot';
  if (main.includes('clear')) return 'clear';
  return 'clouds';
}

function getRecommendations(weatherData, selectedCity) {
  const cityPlaces = CITY_PLACES[selectedCity] ?? CITY_PLACES.Copenhagen;
  const kind = getRecommendationKind(weatherData);
  const profile = WEATHER_PROFILES[kind] ?? WEATHER_PROFILES.clouds;
  const items = profile.categories.map((category) => {
    const place = cityPlaces[category];
    return {
      category,
      categoryLabel: CATEGORY_LABELS[category],
      icon: CATEGORY_ICONS[category],
      title: place.name,
      text: place.description,
    };
  });

  if ((weatherData?.wind?.speed ?? 0) >= 8) {
    items.push({
      category: 'tip',
      categoryLabel: CATEGORY_LABELS.tip,
      icon: CATEGORY_ICONS.tip,
      title: '자전거보다 대중교통을 추천합니다.',
      text: 'Wind tip: 자전거보다 대중교통을 추천합니다.',
    });
  }

  return {
    title: profile.title,
    tone: profile.tone,
    items,
  };
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
    <article className={item.category === 'tip' ? 'recommendation-card tip-card' : 'recommendation-card'}>
      <div className={item.category === 'tip' ? 'icon-badge dark' : 'icon-badge'}>
        <Icon className="h-5 w-5" aria-hidden="true" />
      </div>
      <div>
        <span className="category-label">{item.categoryLabel}</span>
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
  const recommendations = getRecommendations(weather, selectedCity);
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
                <RecommendationCard key={`${item.category}-${item.title}`} item={item} />
              ))}
            </div>
          </section>
        </section>
      </div>
    </main>
  );
}
