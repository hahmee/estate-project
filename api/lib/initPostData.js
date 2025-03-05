// initPostData.js
import prisma from "./prisma.js";
import 'dotenv/config';

// GeoDB Cities API를 사용해 랜덤 국제 도시 정보를 가져오는 함수 (대한민국 제외)
async function getRandomInternationalCity() {
    const offset = getRandomInt(0, 1000);
    const url = `http://geodb-free-service.wirefreethought.com/v1/geo/cities?limit=10&offset=${offset}&minPopulation=100000&sort=-population`;
    const response = await fetch(url);
    const data = await response.json();
    if (data.data && data.data.length > 0) {
        // 대한민국(또는 Korea) 도시는 필터링
        const filteredCities = data.data.filter(
            (city) => city.country !== "South Korea" && city.country !== "Korea"
        );
        if (filteredCities.length > 0) {
            const city = getRandomElement(filteredCities);
            return {
                city: city.name,
                country: city.country,
                lat: city.latitude,
                lng: city.longitude,
                formatted: `${city.name}, ${city.country}`
            };
        }
    }
    throw new Error("No international city found from GeoDB excluding South Korea");
}

// 헬퍼 함수: min~max 범위의 정수를 반환
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// 헬퍼 함수: 배열에서 무작위 요소 반환
function getRandomElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

// 국내 매물용: 한국의 여러 도시
const koreaCities = [
    { city: "서울", province: "서울특별시", lat: 37.5665, lng: 126.9780 },
    { city: "부산", province: "부산광역시", lat: 35.1796, lng: 129.0756 },
    { city: "대구", province: "대구광역시", lat: 35.8714, lng: 128.6014 },
    { city: "인천", province: "인천광역시", lat: 37.4563, lng: 126.7052 },
    { city: "광주", province: "광주광역시", lat: 35.1595, lng: 126.8526 },
    { city: "대전", province: "대전광역시", lat: 36.3504, lng: 127.3845 },
    { city: "울산", province: "울산광역시", lat: 35.5384, lng: 129.3114 },
    { city: "수원", province: "경기도", lat: 37.2636, lng: 127.0286 },
    { city: "성남", province: "경기도", lat: 37.4200, lng: 127.1269 },
    { city: "고양", province: "경기도", lat: 37.6584, lng: 126.8354 },
    { city: "용인", province: "경기도", lat: 37.2410, lng: 127.1770 },
    { city: "부천", province: "경기도", lat: 37.5039, lng: 126.7669 },
    { city: "안산", province: "경기도", lat: 37.3219, lng: 126.8302 },
    { city: "청주", province: "충청북도", lat: 36.6423, lng: 127.4890 },
    { city: "전주", province: "전라북도", lat: 35.8242, lng: 127.1480 },
    { city: "창원", province: "경상남도", lat: 35.2288, lng: 128.6811 },
    { city: "포항", province: "경상북도", lat: 36.0190, lng: 129.3430 },
    { city: "경주", province: "경상북도", lat: 35.8562, lng: 129.2247 },
    { city: "김해", province: "경상남도", lat: 35.2288, lng: 128.8899 },
    { city: "진주", province: "경상남도", lat: 35.1899, lng: 128.1086 },
    { city: "제주", province: "제주특별자치도", lat: 33.4996, lng: 126.5312 },
    { city: "강릉", province: "강원도", lat: 37.7519, lng: 128.8768 },
    { city: "원주", province: "강원도", lat: 37.3414, lng: 127.9196 },
    { city: "춘천", province: "강원도", lat: 37.8813, lng: 127.7298 },
    { city: "속초", province: "강원도", lat: 38.2071, lng: 128.5910 },
    { city: "안동", province: "경상북도", lat: 36.5684, lng: 128.7290 },
    { city: "광명", province: "경기도", lat: 37.4787, lng: 126.8784 },
    { city: "이천", province: "경기도", lat: 37.2759, lng: 127.4463 },
    { city: "평택", province: "경기도", lat: 36.9946, lng: 127.1123 },
    { city: "여수", province: "전라남도", lat: 34.7604, lng: 127.6620 },
    { city: "울릉도", province: "경상북도", lat: 37.4833, lng: 130.8667 }
];

// 매물 유형 및 속성별 데이터 (Prisma enum에 맞게)
const propertyTypes = [
    {
        type: "apartment",
        names: ["모던 아파트", "럭셔리 아파트", "신축 아파트"],
        images: [
            "https://images.unsplash.com/photo-1598928506310-56bd70c2ad42?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
            "https://images.unsplash.com/photo-1560185127-6e0b7e8b6c72?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60"
        ]
    },
    {
        type: "condo",
        names: ["연립주택", "빌라"],
        images: [
            "https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60"
        ]
    },
    {
        type: "officetel",
        names: ["비즈니스 오피스텔", "도심형 오피스텔"],
        images: [
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60"
        ]
    },
    {
        type: "one_room",
        names: ["모던 원룸", "스튜디오"],
        images: [
            "https://images.unsplash.com/photo-1588854337113-6ec43404e53e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60"
        ]
    },
    {
        type: "two_room",
        names: ["넉넉한 투룸", "2베드룸"],
        images: [
            "https://images.unsplash.com/photo-1580584122513-1f82a8a3a7a6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60"
        ]
    },
    {
        type: "land",
        names: ["매매용 땅", "상업용 부지", "토지"],
        images: [
            "https://images.unsplash.com/photo-1579547621706-1a9c79d5f4b8?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60"
        ]
    }
];

// 거래 방식, 방향, 옵션 등
const types = ["month_pay", "year_pay", "sell"];
const directions = ["북향", "남향", "동향", "서향"];
const optionsEnum = ["shoe", "shower_booth", "stove", "closet", "fire_alarm", "veranda"];
const safeOptionsEnum = ["guard", "video_phone", "intercom", "card_key", "cctv", "safety_door", "window_guard"];
const petOptions = ["yes", "no"];
const titlePrefixes = ["최신 매물", "추천 매물", "놓치지 마세요", "특가 매물", "인기 매물"];
const descTemplates = [
    "본 매물은 {address}에 위치한 {propertyName}입니다. {bedroom}개의 침실과 {bathroom}개의 욕실, 총 {size}㎡의 넓은 공간을 자랑하며, 주변 인프라와 교통편의성이 뛰어납니다.",
    "편리한 생활환경과 최신 시설이 갖춰진 {propertyName} 매물입니다. {address}에서 {price}원의 가격으로 제공되며, 주거 만족도가 높습니다.",
    "{address}에 위치한 이 매물은 {propertyName}로, 관리비 {maintenance}원과 {size}㎡의 넓은 면적을 자랑합니다. 자세한 문의 바랍니다.",
    "실속 있는 선택! {propertyName} 매물로, {bedroom} 침실과 {bathroom} 욕실을 갖추고 있으며, 주변 학교와 대중교통이 우수합니다."
];

async function seedPostData() {
    try {
        // 기존 포스트 데이터 삭제
        await prisma.post.deleteMany({});
        console.log("기존 포스팅 데이터 삭제 완료.");

        // 사용자 목록 조회 (반드시 1명 이상 존재)
        const users = await prisma.user.findMany({ select: { id: true } });
        if (!users || users.length === 0) {
            throw new Error("사용자가 없습니다. 먼저 사용자 데이터를 생성하세요.");
        }

        // 총 400개의 포스트 생성: 100 국내, 300 해외
        for (let i = 1; i <= 40; i++) {
            let address, politicalList, lat, lng, location, title, propertyName, imagesArray, propertyType, desc;
            const randomType = getRandomElement(types);

            if (i <= 10) {
                // 국내 매물: 한국의 무작위 도시
                const cityData = getRandomElement(koreaCities);
                address = `대한민국 ${cityData.city}, ${cityData.province}`;
                politicalList = [cityData.city, cityData.province, "대한민국"];
                // 오프셋 범위 크게 적용: 모든 도시 ±0.2
                const offsetRange = 0.2;
                const randomLat = cityData.lat + (Math.random() - 0.5) * offsetRange;
                const randomLng = cityData.lng + (Math.random() - 0.5) * offsetRange;
                lat = randomLat.toFixed(6);
                lng = randomLng.toFixed(6);
                location = { type: "Point", coordinates: [parseFloat(lng), parseFloat(lat)] };

                const propertyData = getRandomElement(propertyTypes);
                propertyName = getRandomElement(propertyData.names);
                propertyType = propertyData.type;
                const numImages = getRandomInt(1, 5);
                imagesArray = Array.from({ length: numImages }, () => getRandomElement(propertyData.images));
                title = `${address} ${propertyName} ${randomType === "sell" ? "매매" : randomType === "year_pay" ? "전세" : "월세"} - ${getRandomElement(titlePrefixes)}`;
            } else {
                // 해외 매물: GeoDB Cities API로 무작위 국제 도시 정보 가져오기 (대한민국 제외)
                let intlCity;
                try {
                    intlCity = await getRandomInternationalCity();
                } catch (error) {
                    console.error("GeoDB API error:", error);
                    // 실패 시 기본값 (런던)
                    intlCity = { city: "London", country: "UK", lat: 51.5074, lng: -0.1278, formatted: "London, UK" };
                }
                address = intlCity.formatted || `${intlCity.city}, ${intlCity.country}`;
                politicalList = address.split(",").map(part => part.trim());
                // 해외 오프셋 범위 크게 적용: ±0.1
                const offsetRange = 0.1;
                const baseLat = parseFloat(intlCity.lat);
                const baseLng = parseFloat(intlCity.lng);
                const randomLat = baseLat + (Math.random() - 0.5) * offsetRange;
                const randomLng = baseLng + (Math.random() - 0.5) * offsetRange;
                lat = randomLat.toFixed(6);
                lng = randomLng.toFixed(6);
                location = { type: "Point", coordinates: [parseFloat(lng), parseFloat(lat)] };

                // 국내와 같이 랜덤한 부동산 속성을 할당
                const propertyData = getRandomElement(propertyTypes);
                propertyName = getRandomElement(propertyData.names);
                propertyType = propertyData.type;
                const numImagesIntl = getRandomInt(1, 5);
                imagesArray = Array.from({ length: numImagesIntl }, () => getRandomElement(propertyData.images));

                title = `${address} ${propertyName} ${randomType === "sell" ? "매매" : randomType === "year_pay" ? "전세" : "월세"} - ${getRandomElement(titlePrefixes)}`;

            }

            const price = getRandomInt(50000, 500000);
            const bedroom = getRandomInt(1, 5);
            const bathroom = getRandomInt(1, 3);
            const maintenance = getRandomInt(1000, 5000);
            const size = getRandomInt(20, 200);
            const createdAt = new Date(Date.now() - getRandomInt(0, 365 * 24 * 3600 * 1000));

            desc = getRandomElement(descTemplates)
                .replace("{address}", address)
                .replace("{propertyName}", propertyName)
                .replace("{bedroom}", bedroom)
                .replace("{bathroom}", bathroom)
                .replace("{size}", size)
                .replace("{maintenance}", maintenance)
                .replace("{price}", price);

            const detailDesc = `${desc} 본 매물은 실내외 환경이 우수하여 투자 및 주거용으로 적합합니다.`;
            const pet = getRandomElement(petOptions);

            const optionCount = getRandomInt(1, 2);
            let options = [];
            for (let j = 0; j < optionCount; j++) {
                options.push(getRandomElement(optionsEnum));
            }
            options = Array.from(new Set(options));

            const safeOptionCount = getRandomInt(1, 2);
            let safeOptions = [];
            for (let j = 0; j < safeOptionCount; j++) {
                safeOptions.push(getRandomElement(safeOptionsEnum));
            }
            safeOptions = Array.from(new Set(safeOptions));

            const school = getRandomInt(1, 5);
            const bus = getRandomInt(1, 5);
            const direction = getRandomElement(directions);
            const parking = getRandomInt(0, 3);

            const randomUser = getRandomElement(await prisma.user.findMany({ select: { id: true } }));

            const post = await prisma.post.create({
                data: {
                    title,
                    price,
                    images: imagesArray,
                    address,
                    politicalList,
                    bedroom,
                    bathroom,
                    latitude: lat,
                    longitude: lng,
                    location,
                    type: randomType,
                    property:propertyType,
                    // property:
                    //     propertyName.toLowerCase().includes("apartment")
                    //         ? "apartment"
                    //         : propertyName.toLowerCase().includes("condo")
                    //             ? "condo"
                    //             : propertyName.toLowerCase().includes("officetel")
                    //                 ? "officetel"
                    //                 : propertyName.toLowerCase().includes("원룸") ||
                    //                 propertyName.toLowerCase().includes("studio")
                    //                     ? "one_room"
                    //                     : propertyName.toLowerCase().includes("투룸") ||
                    //                     propertyName.toLowerCase().includes("2베드룸")
                    //                         ? "two_room"
                    //                         : "land",
                    maintenance,
                    size,
                    createdAt,
                    user: {
                        connect: { id: randomUser.id }
                    },
                    postDetail: {
                        create: {
                            desc: detailDesc,
                            pet,
                            option: options,
                            safeOption: safeOptions,
                            school,
                            bus,
                            direction,
                            parking
                        }
                    }
                }
            });

            console.log(`포스트 ${i} 생성 완료: ${post.id}`);
        }

        console.log("모든 포스트 데이터 삽입 완료.");
    } catch (error) {
        console.error("포스트 데이터 삽입 에러:", error);
    } finally {
        await prisma.$disconnect();
    }
}

seedPostData();
