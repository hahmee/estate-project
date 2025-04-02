import React, {useCallback, useContext, useEffect, useRef, useState} from "react";
import "./navbar.scss";
import {useLocation, useNavigate} from "react-router-dom";
import {AuthContext} from "../../context/AuthContext";
import {useNotificationStore} from "../../lib/notificationStore";
import PlacesAutocomplete, {geocodeByPlaceId} from "react-places-autocomplete";
import {listPostStore} from "../../lib/listPostStore.js";
import {roomOption, typeOption} from "../../routes/newPostPage/newPostPage.jsx";
import MultiRangeSlider from "../slider/MultiRangeSlider.jsx";
import {currencyFormatter} from "../../util/formatting.js";
import Dropdown from "../dropdown/Dropdown.jsx";
import Button from "../../UI/Button.jsx";
import {NavbarContext} from "../../context/NavbarContext.jsx";
import {toast} from "react-toastify";
import {SearchbarContext} from "../../context/SearchbarContext.jsx";
import {usePageUrlStore} from "../../lib/pageUrlStore.js";
import MenuDropdown from "../menuDropdown/MenuDropdown.jsx";
import {SocketContext} from "../../context/SocketContext.jsx";


export const MAX_PRICE = 1000000000;// 1000000000;
export const MIN_PRICE = 0;

export const MAX_SIZE = 60;
export const MIN_SIZE = 0;

export const SEARCH_BY_REGION =[
    {
        img: "https://cdn.pixabay.com/photo/2015/02/14/08/26/gwanghwamun-636113_1280.jpg",
        title: '한국',
        placeId: "ChIJm7oRy-tVZDURS9uIugCbJJE",
    },
    {
        img: "https://cdn.pixabay.com/photo/2014/02/17/10/20/statue-of-liberty-267949_960_720.jpg",
        title: '미국',
        placeId: "ChIJCzYy5IS16lQRQrfeQ5K5Oxw",
    },
    {
        img: "https://cdn.pixabay.com/photo/2022/10/07/07/30/china-7504392_1280.jpg",
        title: '중국',
        placeId: "ChIJwULG5WSOUDERbzafNHyqHZU",
    },
    {
        img: "https://cdn.pixabay.com/photo/2022/02/05/13/12/building-6994803_1280.jpg",
        title: '독일',
        placeId:"ChIJa76xwh5ymkcRW-WRjmtd6HU",
    },
];

export const SEARCH_BY_KOREA = [
    {
        title: '서울',
        placeId: "ChIJzzlcLQGifDURm_JbQKHsEX4",
    },
    {
        title: '부산',
        placeId: "ChIJNc0j6G3raDURpwhxJHTL2DU",
    },
    {
        title: '대전',
        placeId: "ChIJAWZKutdIZTURtdOKmJ3WltE",
    },
    {
        title: '대구',
        placeId: "ChIJ1a3vsrjjZTURMC44oCngkro",
    },
    {
        title: '인천',
        placeId: "ChIJR4ITliVveTURQmG3LJD9N30",
    },
    {
        title: '제주도',
        placeId: "ChIJRUDITFTjDDURMb8emNI2vGY",
    },
    {
        title: '속초',
        placeId: "ChIJsT1we_S82F8RyD8ltFjA9Ho",
    },
    {
        title: '여수',
        placeId: "ChIJr6uLHx-UbTURi26I5drZAok",
    }
];

function Navbar({isSearchBar}) {
    const {socket} = useContext(SocketContext);
    const {isExpanded, changeExpanded, idDropdownOpen, changeIsDropdownOpen} = useContext(NavbarContext);
    const {currentUser} = useContext(AuthContext);
    const {searchValue, changeSearchValue, clearSearchValue} = useContext(SearchbarContext);
    const userFetch = useNotificationStore((state) => state.fetch);
    const number = useNotificationStore((state) => state.number);
    const navigate = useNavigate();
    const [notClicked, setNotClicked] = useState(false);
    const [currentClicked, setCurrentClicked] = useState(0);
    const [status, setStatus] = useState("");
    const setIsLoading = listPostStore((state) => state.setIsLoading);
    const [latitude, setLatitude] = useState("");
    const [longitude, setLongitude] = useState("");
    const [location, setLocation] = useState(searchValue.location);
    const [minPrice, setMinPrice] = useState(searchValue.minPrice);
    const [maxPrice, setMaxPrice] = useState(searchValue.maxPrice);
    const [minSize, setMinSize] = useState(searchValue.minSize);
    const [maxSize, setMaxSize] = useState(searchValue.maxSize);
    const [types, setTypes] = useState(searchValue.payType);
    const [rooms, setRooms] = useState(searchValue.propertyType);
    const [searchType, setSearchType] = useState(searchValue.search_type);
    const [neLat, setNelat] = useState(searchValue.ne_lat);
    const [neLng, setNeLng] = useState(searchValue.ne_lng);
    const [swLat, setSwLat] = useState(searchValue.sw_lat);
    const [swLng, setSwLng] = useState(searchValue.sw_lng);
    const [lastPoliticalValue, setLastPoliticalValue] = useState("");
    const setCurrentUrl = usePageUrlStore((state) => state.setCurrentUrl);
    const setPrvUrl = usePageUrlStore((state) => state.setPrvUrl);
    const currentLocation = useLocation();
    const [prevLocation, setPrevLocation] = useState(null);
    const lastSavedLocation = useRef(null); // temp buffer
    const setIsFetch = listPostStore((state) => state.setIsFetch);
    const increase = useNotificationStore((state) => state.increase);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLocationOpen, setIsLocationOpen] = useState(false);

    const handleLocationChange = (location) => {
        setStatus("");
        setLocation(location);
        setIsLocationOpen(() => location && location.trim().length > 0 ? false : true);

    };

    const handleSelect = async (location = null, placeId) => {
        const [place] = await geocodeByPlaceId(placeId);
        const address = place.formatted_address;
        const viewPort = place.geometry.viewport.toJSON()
        setNelat(viewPort.south);
        setNeLng(viewPort.west);
        setSwLat(viewPort.north);
        setSwLng(viewPort.east);
        // changeSearchValue
        //마지막 political 값을 찾는다.
        const {long_name: lastPoliticalValue} = place.address_components.find(c => c.types.includes('political'));
        setLastPoliticalValue(lastPoliticalValue);

        setLocation(address);
        setLatitude(place.geometry.location.lat());
        setLongitude(place.geometry.location.lng());

        if (address) {
            setCurrentClicked(2);
        }
    };

    const onError = (status, clearSuggestions) => {
        setStatus(status === "ZERO_RESULTS" ? '해당 장소를 찾을 수 없습니다.' : status);
        clearSuggestions();
    }

    const searchClick = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsLoading(true);
        setIsFetch(true);

        changeSearchValue({
            location: location,
            payType: types,
            propertyType: rooms,
            minPrice: minPrice,
            maxPrice: maxPrice,
            minSize: minSize,
            maxSize: maxSize,
            latitude: latitude,
            longitude: longitude,
            search_type: searchType,
            ne_lat: neLat,
            ne_lng: neLng,
            sw_lat: swLat,
            sw_lng: swLng
        });

        if (!location || !latitude || !longitude) {
            toast.error('주소지를 정확히 입력해주세요.');
            return;
        }

        if (types.length < 1) {
            toast.error('거래 유형을 선택해주세요.');
            return;
        }

        if (rooms.length < 1) {
            toast.error('매물 종류를 선택해주세요.');
            return;
        }

        const sendTypes = types.join('&type=');
        const sendProperties = rooms.join('&property=');

        setIsLoading(false);
        //url이 변경되게 해야함..
        navigate(`/list?type=${sendTypes}&location=${location}&political=${lastPoliticalValue}&latitude=${latitude}&longitude=${longitude}&property=${sendProperties}&minPrice=${minPrice}&maxPrice=${maxPrice}&minSize=${minSize}&maxSize=${maxSize}&searchedLat=${latitude}&searchedLng=${longitude}&search_type=${searchType}&ne_lat=${neLat}&ne_lng=${neLng}&sw_lat=${swLat}&sw_lng=${swLng}`);

    };

    const deleteLocation = () => {
        setLocation("");
    };

    const clickMenu = (number) => {
        changeIsDropdownOpen(true);
        setCurrentClicked(number);
        setNotClicked(true);
    };

    const searchByRegion = async (placeId) => {
        handleSelect(null, placeId);
    };

    const closeDropdown = useCallback(() => {
        setCurrentClicked(0);
        setNotClicked(false);
        changeExpanded(false); // 위로 고정
    }, []);


    const onClickSearchBar = useCallback((e) => {
        e.stopPropagation();
        changeExpanded(true);
    }, []);


    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    const toggleMenu = () => {
        setIsMenuOpen(prevState => !prevState);
    };

    useEffect(() => {
        setLocation(searchValue.location);
        setLatitude(searchValue.latitude);
        setLongitude(searchValue.longitude);
        setMinPrice(searchValue.minPrice);
        setMaxPrice(searchValue.maxPrice);
        setMinSize(searchValue.minSize);
        setMaxSize(searchValue.maxSize);
        setTypes(searchValue.payType);
        setRooms(searchValue.propertyType);
    }, [searchValue]);


    //pageUrlStorage에 url 변경될때마다 현재 url 담는다.
    useEffect(() => {
        window.scrollTo(0, 0); // 페이지 이동시 스크롤 맨 위

        setPrevLocation(lastSavedLocation.current); //lastSavedLocation담겨있는 값 넣기
        lastSavedLocation.current = currentLocation; // 현재 값 lastSavedLocation에 넣기
        setCurrentUrl(currentLocation);

        // 서치바가 있는 navbar
        if (isSearchBar) {

            //리스트와 single 페이지
            const paths = [/^\/list$/, /^\/read(\/[^/]+)?$/];

            const currentPath = currentLocation.pathname;

            //paths에 해당하지 않는 경로이다. ( ex 메인페이지 )
            const isNotPaths = !paths.some((path) => path.test(currentPath))

            changeExpanded(isNotPaths);

            const handleScroll = () => {
                // 스크롤할 때는 무조건 dropdown을 닫아준다.
                changeIsDropdownOpen(false);

                if(isNotPaths) {
                    if (window.scrollY > 30) {
                        changeExpanded(false);
                    } else {
                        changeExpanded(true);
                    }
                }else{
                    changeExpanded(false);
                }

            };

            window.addEventListener("scroll", handleScroll);

            return () => {
                window.removeEventListener("scroll", handleScroll);
            };
        }else{
            changeExpanded(false);
        }

    }, [currentLocation.pathname]);

    //pageUrlStorage에 url 변경될때마다 이전 url 담는다.
    useEffect(() => {
        setPrvUrl(prevLocation);
    }, [prevLocation]);

    useEffect(() => {
        const handleSocketGetMessage = async (data) => {
            //채팅방이 만들어지면, 알림 +1
            increase(data.chatId);
        };

        if(socket) {
            socket.on("getMessage", handleSocketGetMessage);
        }
        return () => {
            if (socket) {
                socket.off("getMessage", handleSocketGetMessage);
            }
        };

    }, [socket]);


    useEffect(() => {

        return () => clearSearchValue(); //에러나서 우선 주석
    }, []);


    //  문제 - currentUser가 변경되지 않았는데도, 리렌더링됨
    // 이유 - Navbar가 Layout 안에 공통으로 있더라도, React Router에서 페이지를 이동하면 Layout이 다시 렌더링되면서 Navbar도 다시 마운트됨
    // 고침 - CommonLayout 에 Navbar 공통
    useEffect(() => {
        if (currentUser) {
            userFetch();
        }else{
            //currentUser 가 null이면 (로그아웃) 로그인 페이지로 이동
            navigate("/login");
        }
    }, [currentUser]);


    return (
        <>
            {
                (currentClicked !== 0) && <div className="searchClickBackground"></div>
                //밖에 클릭했을 때 기본 nav로 돌아가게
            }

            {/*MOBILE*/}
            <div className="mobile-nav">
                <div className="mobile-nav__search">
                    <div className="material-symbols-outlined mobile-nav__icon">search</div>
                    <div className="mobile-nav__texts">
                        <span className="mobile-nav__text">도시를 검색해주세요.</span>
                        <span className="mobile-nav__text">모든 유형 무제한 60평이상</span>
                    </div>
                </div>
            </div>


            <nav className={isExpanded ? "topNav" : null}>
                <div className='upperNav'>
                    <div className="logo" onClick={() => navigate('/')}>
                        <span className="material-symbols-outlined logoImg">house</span>
                        <span className="estate_logo">Estate App</span>
                    </div>
                    <div className="spand"></div>
                    <div>
                        {
                            currentUser && (
                                <div className="user">
                                    <Button onClick={() => navigate("/location")} className="postingBtn">포스팅하기</Button>
                                    <div className="profile">
                                        { number > 0 && <div className="notification" onClick={toggleMenu}>{number}</div>}
                                        <img src={currentUser.avatar || "/noavatar.jpg"} alt="avatar" onClick={toggleMenu}/>
                                        <span onClick={toggleMenu}>{currentUser.username}</span>
                                        {
                                            isMenuOpen ?
                                                <span className="material-symbols-outlined icon"
                                                      onClick={toggleMenu}>keyboard_arrow_up</span>
                                                :
                                                <span className="material-symbols-outlined icon"
                                                      onClick={toggleMenu}>keyboard_arrow_down</span>
                                        }
                                        {/* 드롭다운 메뉴 */}
                                        <MenuDropdown isDropdownOpen={isMenuOpen} closeMenu={closeMenu}/>
                                    </div>
                                </div>
                            )
                        }
                    </div>
                </div>
                {
                    isSearchBar &&
                    (
                        <>
                            <div className={"bottomNav"}>
                                <PlacesAutocomplete
                                    value={location}
                                    onChange={handleLocationChange}
                                    onSelect={handleSelect}
                                    onError={onError}
                                    searchOptions={{types: ['political']}}
                                    // searchOptions={{types: ['geocode']}}
                                    // searchOptions={{types: ['country', 'locality', 'sublocality']}}
                                >
                                    {({getInputProps, suggestions, getSuggestionItemProps, loading}) => (
                                        <>
                                            <div className={`search ${notClicked ? 'notClicked' : null}`} onClick={(e) => onClickSearchBar(e)}>
                                                <div className={`location ${currentClicked === 1 && 'clickedMenu'}`}
                                                     onClick={() => {
                                                         clickMenu(1);
                                                         setIsLocationOpen(true);
                                                     }}>
                                                    <p className={isExpanded ? "" : 'displayNone'}>위치</p>
                                                    <input type="text"
                                                           {...getInputProps({
                                                               placeholder: '도시를 검색하세요.',
                                                               className: 'inputDiv',
                                                           })}/>
                                                    <span
                                                        className={
                                                            (location && location.trim().length > 0) && isExpanded
                                                                ? "material-symbols-outlined closeIcon"
                                                                : "material-symbols-outlined closeIcon displayNone"
                                                        }
                                                        onClick={() => deleteLocation()}
                                                    >
                                                  close
                                                </span>
                                                </div>


                                                <div className={`check-in ${currentClicked === 2 && 'clickedMenu'}`}
                                                     onClick={() => clickMenu(2)}>
                                                <p className={isExpanded ? "" : 'displayNone'}>유형</p>
                                                    <span className="inputDiv">
                                                    {
                                                        ((types && rooms) && (types.length + rooms.length === 9)) ?
                                                            '모든 유형' : [...types, ...rooms].map((type) => {
                                                                return <p
                                                                    key={type}>{[...typeOption, ...roomOption].find(option => option.value === type).label}, &nbsp;</p>
                                                            })
                                                    }
                                                    </span>
                                                </div>
                                                <div className={`check-out ${currentClicked === 3 && 'clickedMenu'}`}
                                                     onClick={() => clickMenu(3)}>
                                                    <p className={isExpanded ? "" : 'displayNone'}>가격</p>
                                                    <span
                                                        className="inputDiv">{currencyFormatter.format(minPrice)}&nbsp;~&nbsp;{(MAX_PRICE === maxPrice) ? '무제한' : currencyFormatter.format(maxPrice)}</span>
                                                </div>
                                                <div className={`guests ${currentClicked === 4 && 'clickedMenu'}`}
                                                     onClick={() => clickMenu(4)}>
                                                    <p className={isExpanded ? "" : 'displayNone'}>크기</p>
                                                    <span
                                                        className="inputDiv">{minSize}평&nbsp;~&nbsp;{(MAX_SIZE === maxSize) ? '60평 이상' : `${maxSize}평`}</span>
                                                    <span className="material-symbols-outlined"
                                                          onClick={(e) => searchClick(e)}>search</span>
                                                </div>
                                            </div>

                                            <Location
                                                location={location}
                                                suggestions={suggestions}
                                                getSuggestionItemProps={getSuggestionItemProps}
                                                loading={loading} status={status}
                                                shown={(currentClicked === 1) && idDropdownOpen}
                                                close={closeDropdown}
                                                scrollTop={true}
                                                searchByRegion={searchByRegion}
                                                isOpen={isLocationOpen}
                                            />

                                            <Category types={types} setTypes={setTypes} rooms={rooms}
                                                      setRooms={setRooms}
                                                      shown={(currentClicked === 2) && idDropdownOpen}
                                                      close={closeDropdown}
                                                      scrollTop={true}/>

                                            <Price minPrice={minPrice} setMinPrice={setMinPrice} maxPrice={maxPrice}
                                                   setMaxPrice={setMaxPrice}
                                                   shown={(currentClicked === 3) && idDropdownOpen}
                                                   close={closeDropdown}
                                                   scrollTop={true}/>

                                            <Size minSize={minSize} setMinSize={setMinSize} maxSize={maxSize}
                                                  setMaxSize={setMaxSize}
                                                  shown={(currentClicked === 4) && idDropdownOpen}
                                                  close={closeDropdown}
                                                  scrollTop={true}/>
                                        </>
                                    )}
                                </PlacesAutocomplete>
                            </div>
                        </>
                    )
                }
            </nav>
        </>

    );
}

const Location = ({location, suggestions, getSuggestionItemProps, loading, status, shown, close, scrollTop, searchByRegion,isOpen}) => {
    return (
        <Dropdown
            shown={shown}
            close={close}
            scrollTop={scrollTop}
        >
            <div className='otherSuggestion'>
                <div className="autocomplete-dropdown">
                    {
                        isOpen && (
                            <div className="autocomplete-dropdown-content">
                                <div className="searchByRegion">지역으로 검색하기</div>
                                <div className="searchByRegionContent">
                                    {
                                        SEARCH_BY_REGION.map((data) => {
                                            return (
                                                <div key={data.title}>
                                                    <img className="regionImg" src={data.img} alt='img' onClick={() => searchByRegion(data.placeId)} loading="lazy"/>
                                                    <div className="regionContent">{data.title}</div>
                                                </div>);
                                        })
                                    }
                                </div>
                                <div className="searchByRegion">한국</div>
                                <div className="searchBox">
                                    {
                                        SEARCH_BY_KOREA.map((data) => {
                                            return (<div key={data.title} className="labelDiv" onClick={() => searchByRegion(data.placeId)}>{data.title}</div>);
                                        })
                                    }
                                </div>
                            </div>
                        )
                    }

                    {loading && <div className="suggestion-item">검색중...</div>}
                    {status && <div className="suggestion-item">{status}</div>}
                    {suggestions.map((suggestion) => {
                        const className = suggestion.active
                            ? 'suggestion-item--active'
                            : 'suggestion-item';
                        return (
                            <div
                                key={suggestion.placeId}
                                {...getSuggestionItemProps(suggestion, {
                                    className,
                                })}
                            >
                                <div className="locationIcon">
                                    <span className="material-symbols-outlined">location_on</span>
                                </div>
                                <span>{suggestion.description}</span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </Dropdown>

    );

};

const Size = ({minSize, setMinSize, maxSize, setMaxSize, shown, close, scrollTop}) => {

    return (
        <Dropdown
            shown={shown}
            close={close}
            scrollTop={scrollTop}
        >
            <div className='otherSuggestion'>
                <div className="selectBig">
                    <p>방 크기를 설정해주세요.</p>
                    <div className="selectDivSlider">
                        <MultiRangeSlider
                            min={MIN_SIZE}
                            max={MAX_SIZE}
                            minVal={minSize}
                            setMinVal={setMinSize}
                            maxVal={maxSize}
                            setMaxVal={setMaxSize}
                            step={10}
                            text={{left: '10평 미만', right: '60평 이상', middle: '30평대', total: '60평 이상'}}
                            format={(data) => `${data}평`}
                            onChange={({min, max}) => {
                                setMinSize(min);
                                setMaxSize(max);
                            }}
                        />
                    </div>
                </div>
            </div>
        </Dropdown>
    );

};
const Price = ({minPrice, setMinPrice, maxPrice, setMaxPrice, shown, close, scrollTop}) => {
    const stepCondition = (event) => {
        if (event.target.value < 500000000) { //오억
            return 50000000; //5천만원
        } else {
            return 100000000; //1억
        }
    }
    return (
        <Dropdown
            shown={shown}
            close={close}
            scrollTop={scrollTop}
        >
            <div className='otherSuggestion'>
                <div className="selectBig">
                    <p>금액대를 설정해주세요.</p>
                    <div className="selectDivSlider">

                        <MultiRangeSlider
                            min={MIN_PRICE}
                            max={MAX_PRICE}
                            minVal={minPrice}
                            maxVal={maxPrice}
                            step={50000000}
                            setMinVal={setMinPrice}
                            setMaxVal={setMaxPrice}
                            stepCondition={stepCondition}
                            text={{
                                left: '최소',
                                right: '최대',
                                middle: currencyFormatter.format(1000000000 / 2),
                                total: '무제한'
                            }}
                            format={currencyFormatter.format}
                            onChange={({min, max}) => {
                                setMinPrice(min);
                                setMaxPrice(max);
                            }}
                        />
                    </div>
                </div>
            </div>
        </Dropdown>
    );
};

const Category = ({types, rooms, setTypes, setRooms, shown, close, scrollTop}) => {

    const clickTypeOption = (option) => {
        if (types?.includes(option.value)) {
            setTypes((prev) => prev.filter((element) => (element != option.value)));
        } else {
            setTypes([...types, option.value]);
        }
    }

    const clickRoomOption = (option) => {

        if (rooms?.includes(option.value)) {
            setRooms((prev) => prev.filter((element) => (element != option.value)));
        } else {
            setRooms([...rooms, option.value]);
        }
    }

    return (
        <Dropdown
            shown={shown}
            close={close}
            // scrollTop={scrollTop}
        >
            <div className='otherSuggestion'>
                <div className="selectBig">
                    <p>거래 유형을 선택하세요.</p>

                    <div className="selectDiv">
                        {
                            typeOption.map((option) => {
                                return <div key={option.value} className={`labelDiv ${types?.includes(option.value) && 'clicked'}`} onClick={() => clickTypeOption(option)}>{option.label}</div>
                            })
                        }
                    </div>
                </div>

                <div className="selectBig">
                    <p>매물 종류를 선택하세요.</p>
                    <div className="selectDiv">
                        {
                            roomOption.map((option) => {
                                return <div key={option.value}
                                            className={`labelDiv ${rooms?.includes(option.value) && 'clicked'}`}
                                            onClick={() => clickRoomOption(option)}>{option.label}</div>
                            })
                        }
                    </div>
                </div>
            </div>
        </Dropdown>);
};

export default Navbar;
