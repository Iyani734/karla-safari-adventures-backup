import { useState, useEffect, useRef } from "react";
import { X, ChevronLeft, ChevronRight, Camera, Compass, MessageCircle, StickyNote, Download, Share2 } from "lucide-react";
import { motion } from "framer-motion";
import { GALLERY_IMAGE_SEO, getGalleryImageSeo, type GalleryImageSeo } from "../lib/gallerySeoData";

const HEIGHTS = ["h-64", "h-48", "h-56", "h-52", "h-44", "h-60", "h-40", "h-72"];

const loadedCache = new Set<string>();

const preloadImage = (src: string) => {
  if (loadedCache.has(src)) return;
  const img = new Image();
  img.onload = () => loadedCache.add(src);
  img.src = src;
};

const SHIMMER_STYLE = `
  @keyframes shimmer {
    0%   { background-position: -200% 0; }
    100% { background-position:  200% 0; }
  }
`;

// ── All 2,364 gallery images hardcoded ──────────────────────────────────────
const ALL_IMAGES: string[] = [
  "/aberdare1.webp", "/aberdare10.webp", "/aberdare11.webp", "/aberdare12.webp", "/aberdare13.webp", "/aberdare14.webp",
  "/aberdare15.webp", "/aberdare16.webp", "/aberdare17.webp", "/aberdare18.webp", "/aberdare19.webp", "/aberdare2.webp",
  "/aberdare20.webp", "/aberdare21.webp", "/aberdare22.webp", "/aberdare23.webp", "/aberdare3.webp", "/aberdare4.webp",
  "/aberdare5.webp", "/aberdare6.webp", "/aberdare7.webp", "/aberdare8.webp", "/aberdare9.webp", "/aberdareInKenya.webp",
  "/abseil-table-mountain.webp", "/africa-kenya.webp", "/africa-rwanda.webp", "/africa-southafrica.webp", "/africa-tanzania.webp", "/africa-uganda.webp",
  "/african-fish-eagle.webp", "/african-fish-eagle2.webp", "/African-Green-Broadbill.webp", "/airstrip.webp", "/airstrip2.webp", "/airstrip3.webp",
  "/amboseli.webp", "/amboseli1.webp", "/amboseli10.webp", "/amboseli11.webp", "/amboseli12.webp", "/amboseli2.webp",
  "/amboseli3.webp", "/amboseli4.webp", "/amboseli5.webp", "/amboseli6.webp", "/amboseli7.webp", "/amboseli9.webp",
  "/amboseli_gd.webp", "/antelope.webp", "/antelope2.webp", "/apartheid-museum.webp", "/artGalleries.webp", "/artisanWorkshop.webp",
  "/arushaGateway1.webp", "/arushaGateway2.webp", "/arushaGateway3.webp", "/arushaGateway4.webp", "/arushaGateway5.webp", "/arushaGateway6.webp",
  "/arushaGateway7.webp", "/arushaGateway8.webp", "/Ashnil1.webp", "/Ashnil2.webp", "/Ashnil3.webp", "/Ashnil4.webp",
  "/Ashnil5.webp", "/Ashnil6.webp", "/Ashnil7.webp", "/Ashnil8.webp", "/Ashnil9.webp", "/avian1.webp",
  "/avian10.webp", "/avian2.webp", "/avian3.webp", "/avian4.webp", "/avian5.webp", "/avian6.webp",
  "/avian7.webp", "/avian8.webp", "/avian9.webp", "/background_Amboseli.webp", "/backHome.webp", "/backHome1.webp",
  "/baglafecht-weaver.webp", "/ballon1.webp", "/ballon2.webp", "/ballon3.webp", "/ballon4.webp", "/ballon5.webp",
  "/ballon6.webp", "/ballon7.webp", "/balloon-masai-mara.webp", "/balloon-safaris-kenya.webp", "/baloon1.webp", "/banana.webp",
  "/bastian1.webp", "/bastian10.webp", "/bastian11.webp", "/bastian12.webp", "/bastian13.webp", "/bastian14.webp",
  "/bastian15.webp", "/bastian16.webp", "/bastian2.webp", "/bastian3.webp", "/bastian4.webp", "/bastian5.webp",
  "/bastian6.webp", "/bastian7.webp", "/bastian8.webp", "/bastian9.webp", "/batwaCommunity.webp", "/beach-relaxing3.webp",
  "/beach.webp", "/big-cat-sanctuary.webp", "/big5.webp", "/bigodi community.webp", "/bigodi_community.webp", "/biking.webp",
  "/biking2.webp", "/Birding-Experience-in-Uganda.webp", "/birdWatching.webp", "/birdWatching2.webp", "/birdWatching3.webp", "/blackRhino1.webp",
  "/blyde-river-canyon.webp", "/bo-kaap.webp", "/boababMara1.webp", "/boababMara10.webp", "/boababMara11.webp", "/boababMara12.webp",
  "/boababMara13.webp", "/boababMara2.webp", "/boababMara3.webp", "/boababMara4.webp", "/boababMara5.webp", "/boababMara6.webp",
  "/boababMara7.webp", "/boababMara8.webp", "/boababMara9.webp", "/boatRide.webp", "/boatSafari.webp", "/boatSafari2.webp",
  "/boatSafari3.webp", "/boatSafari4.webp", "/bombasimbasafarilodge1.webp", "/bombasimbasafarilodge2.webp", "/bombasimbasafarilodge3.webp", "/bombasimbasafarilodge4.webp",
  "/bombasimbasafarilodge5.webp", "/bombasimbasafarilodge6.webp", "/bombasimbasafarilodge7.webp", "/bombasimbasafarilodge8.webp", "/bonfire.webp", "/bougainvillea-safari-lodge1.webp",
  "/bougainvillea-safari-lodge2.webp", "/bougainvillea-safari-lodge3.webp", "/bougainvillea-safari-lodge4.webp", "/bougainvillea-safari-lodge5.webp", "/bougainvillea-safari-lodge6.webp", "/bougainvillea-safari-lodge7.webp",
  "/bougainvillea-safari-lodge8.webp", "/Boulders-Beach-Cape-Point-Villa.webp", "/Budongo-Forest.webp", "/buffalo2.webp", "/buffalo3.webp", "/buffalo4.webp",
  "/buffalo5.webp", "/bungeeJump.webp", "/bush1.webp", "/bush2.webp", "/bush3.webp", "/bush4.webp",
  "/bush5.webp", "/bush6.webp", "/bush7.webp", "/bushBreakFast.webp", "/bushDinner.webp", "/bushDinner2.webp",
  "/bweze1.webp", "/bweze2.webp", "/bweze3.webp", "/bweze4.webp", "/bweze5.webp", "/bweze6.webp",
  "/bwindi.webp", "/bwindi2.webp", "/bwindi3.webp", "/bwindi4.webp", "/byebye.webp", "/byebye2.webp",
  "/byeSummer.webp", "/byeuganda.webp", "/camp-lilac.webp", "/camp-lilac2.webp", "/camp-lilac3.webp", "/camp-lilac31.webp",
  "/camp-lilac4.webp", "/camp-lilac5.webp", "/camp-lilac6.webp", "/camp-lilac7.webp", "/camp-lilac8.webp", "/camp-lilac9.webp",
  "/camping.webp", "/camping1.webp", "/camping2.webp", "/camping3.webp", "/camping4.webp", "/camping5.webp",
  "/camping6.webp", "/camping7.webp", "/cango-caves.webp", "/canopy-tour.webp", "/canopy1.webp", "/canopy2.webp",
  "/canopy3.webp", "/Cape-Town-Beaches-Guide-Clifton-Blue-Flag.webp", "/cape-town-nightlife.webp", "/cape-town-tandem-paragliding-adventure.webp", "/carmelSafari.webp", "/cattle-egret.webp",
  "/caving.webp", "/chambai1.webp", "/chambai2.webp", "/chambai3.webp", "/chambai4.webp", "/chambai5.webp",
  "/chambai6.webp", "/chapmans-peak-drive.webp", "/cheatah.webp", "/cheateh2.webp", "/chetah.webp", "/chimpanzee.webp",
  "/chimpu1.webp", "/chimpu2.webp", "/chimpu3.webp", "/chimpu4.webp", "/chimpu5.webp", "/chimpu6.webp",
  "/chimpu7.webp", "/chipanzee1.webp", "/colobusMonkeys.webp", "/cooking.webp", "/couple_gorilla_trekking__.webp", "/cratersEdge1.webp",
  "/cratersEdge10.webp", "/cratersEdge11.webp", "/cratersEdge12.webp", "/cratersEdge13.webp", "/cratersEdge2.webp", "/cratersEdge3.webp",
  "/cratersEdge4.webp", "/cratersEdge6.webp", "/cratersEdge7.webp", "/cratersEdge8.webp", "/cratersEdge9.webp", "/crowned-hornbill.webp",
  "/crowned-hornbill2.webp", "/Cultural-experiences-in-Uganda.webp", "/cultural-festivals.webp", "/culturalFestivals.webp", "/culture1.webp", "/culture10.webp",
  "/culture11.webp", "/culture12.webp", "/culture13.webp", "/culture14.webp", "/culture2.webp", "/culture3.webp",
  "/culture4.webp", "/culture5.webp", "/culture6.webp", "/culture7.webp", "/culture8.webp", "/culture9.webp",
  "/customSafari.webp", "/customSafari1.webp", "/customSafari2.jpg", "/customSafari3.webp", "/cycling.webp", "/cyclingWildUganda.webp",
  "/Deep-Sea-Fishing.webp", "/dhow.webp", "/dhowSunsetCruise.webp", "/diani.webp", "/dianiSea1.webp", "/dianiSea10.webp",
  "/dianiSea2.webp", "/dianiSea3.webp", "/dianiSea4.webp", "/dianiSea5.webp", "/dianiSea6.webp", "/dianiSea7.webp",
  "/dianiSea8.webp", "/dianiSea9.webp", "/dine.webp", "/Dining_GameDrive_Sundowners.webp", "/diving.webp", "/dolphins.webp",
  "/drakensberg-mountains.webp", "/elephant10.webp", "/elephant11.webp", "/elephant12.webp", "/elephant13.webp", "/elephant14.webp",
  "/elephant15.webp", "/elephant16.webp", "/elephant17.webp", "/elephant18.webp", "/elephant19.webp", "/elephant2.webp",
  "/elephant20.webp", "/elephant21.webp", "/elephant22.webp", "/elephant23.webp", "/elephant24.webp", "/elephant25.webp",
  "/elephant26.webp", "/elephant27.webp", "/elephant28.webp", "/elephant29.webp", "/elephant3.webp", "/elephant30.webp",
  "/elephant31.webp", "/elephant32.webp", "/elephant33.webp", "/elephant34.webp", "/elephant35.webp", "/elephant36.webp",
  "/elephant38.webp", "/elephant39.webp", "/elephant4.webp", "/elephant40.webp", "/elephant41.webp", "/elephant42.webp",
  "/elephant43.webp", "/elephant44.webp", "/elephant45.webp", "/Elephant46.webp", "/elephant47.webp", "/elephant5.webp",
  "/elephant6.webp", "/elephant7.webp", "/elephant8.webp", "/elephant9.webp", "/elephantIcon1.webp", "/elephantIcon2.webp",
  "/elephants_amboseli.webp", "/elephants_amboseli2.webp", "/Elephants_luxury.webp", "/elephants_sunset.webp", "/elewana1.webp", "/elewana2.webp",
  "/elewana3.webp", "/elewana4.webp", "/elewana5.webp", "/elewana6.webp", "/elewana7.webp", "/elewana8.webp",
  "/elewana9.webp", "/elsa1.webp", "/elsa10.webp", "/elsa11.webp", "/elsa12.webp", "/elsa13.webp",
  "/elsa14.webp", "/elsa15.webp", "/elsa16.webp", "/elsa2.webp", "/elsa3.webp", "/elsa4.webp",
  "/elsa5.webp", "/elsa6.webp", "/elsa7.webp", "/elsa8.webp", "/elsa9.webp", "/emerald1.webp",
  "/emerald10.webp", "/emerald11.webp", "/emerald2.webp", "/emerald3.webp", "/emerald4.webp", "/emerald5.webp",
  "/emerald6.webp", "/emerald7.webp", "/emerald8.webp", "/emerald9.webp", "/engai1.webp", "/engai10.webp",
  "/engai11.webp", "/engai12.webp", "/engai13.webp", "/engai2.webp", "/engai3.webp", "/engai4.webp",
  "/engai5.webp", "/engai6.webp", "/engai7.webp", "/engai8.webp", "/engai9.webp", "/enkorok1.webp",
  "/enkorok10.webp", "/enkorok11.webp", "/enkorok12.webp", "/enkorok13.webp", "/enkorok2.webp", "/enkorok3.webp",
  "/enkorok4.webp", "/enkorok5.webp", "/enkorok6.webp", "/enkorok7.webp", "/enkorok8.webp", "/enkorok9.webp",
  "/equator.webp", "/fig1.webp", "/fig2.webp", "/fig3.webp", "/fig4.webp", "/fig5.webp",
  "/fig6.webp", "/fig7.webp", "/final1.webp", "/final2.webp", "/fine-dining-cape-town.webp", "/fischers-lovebird.webp",
  "/fishing.webp", "/flamingo.webp", "/flamingo2.webp", "/flying-safari-masaimara.webp", "/forestWalk.webp", "/fortJesus.webp",
  "/fourSeasons1.webp", "/fourSeasons10.webp", "/fourSeasons11.webp", "/fourSeasons12.webp", "/fourSeasons13.webp", "/fourSeasons2.webp",
  "/fourSeasons3.webp", "/fourSeasons4.webp", "/fourSeasons5.webp", "/fourSeasons6.webp", "/fourSeasons7.webp", "/fourSeasons8.webp",
  "/fourSeasons9.webp", "/gameDrive1.webp", "/garden-route-drive.webp", "/genocide.webp", "/giraffe1.webp", "/giraffe10.webp",
  "/giraffe11.webp", "/giraffe12.webp", "/giraffe13.webp", "/giraffe14.webp", "/giraffe15.webp", "/giraffe16.webp",
  "/giraffe17.webp", "/giraffe18.webp", "/giraffe19.webp", "/giraffe2.webp", "/giraffe20.webp", "/giraffe21.webp",
  "/giraffe22.webp", "/giraffe23.webp", "/giraffe24.webp", "/giraffe25.webp", "/giraffe3.webp", "/giraffe4.webp",
  "/giraffe5.webp", "/giraffe6.webp", "/giraffe7.webp", "/giraffe8.webp", "/giraffe9.webp", "/goldenMonkey.webp",
  "/goldenMonkey1.webp", "/goldenMonkey2.webp", "/goldenMonkeys.webp", "/golfing.webp", "/gorilla1.webp", "/gorilla2.webp",
  "/gorilla3.webp", "/gorilla4.webp", "/gorilla5.webp", "/gorillaDP.webp", "/gorillaDP2.webp", "/gorrila1.webp",
  "/gorrila2.webp", "/great-indian-hornbill.webp", "/grey-crowned-crane.webp", "/guidedWalk.webp", "/hadada-ibis.webp", "/hadada-ibis2.webp",
  "/hadzaTribe.webp", "/hartlaubs-bustard.webp", "/hartlaubs-bustard2.webp", "/hartlaubs-turaco.webp", "/helicopter-tour-cape-town.webp", "/Helicopter-Tour-in-Serengeti-Tanzania-1.webp",
  "/hellGate.webp", "/hellGate2.webp", "/hhando-coffee-lodge1.webp", "/hhando-coffee-lodge10.webp", "/hhando-coffee-lodge11.webp", "/hhando-coffee-lodge12.webp",
  "/hhando-coffee-lodge13.webp", "/hhando-coffee-lodge2.webp", "/hhando-coffee-lodge3.webp", "/hhando-coffee-lodge4.webp", "/hhando-coffee-lodge5.webp", "/hhando-coffee-lodge6.webp",
  "/hhando-coffee-lodge7.webp", "/hhando-coffee-lodge8.webp", "/hhando-coffee-lodge9.webp", "/highlandsCamp1.webp", "/highlandsCamp10.webp", "/highlandsCamp2.webp",
  "/highlandsCamp3.webp", "/highlandsCamp4.webp", "/highlandsCamp5.webp", "/highlandsCamp6.webp", "/highlandsCamp7.webp", "/highlandsCamp8.webp",
  "/highlandsCamp9.webp", "/hike.webp", "/hike2.webp", "/Hiking-the-top-of-murchison-falls-1.webp", "/hiking.webp", "/hiking2.webp",
  "/hiking3.webp", "/hiking4.webp", "/hiking5.webp", "/hiking6.webp", "/hiking7.webp", "/hiking8.webp",
  "/hillcourt1.webp", "/hillcourt10.webp", "/hillcourt2.webp", "/hillcourt3.webp", "/hillcourt4.webp", "/hillcourt5.webp",
  "/hillcourt6.webp", "/hillcourt7.webp", "/hillcourt8.webp", "/hillcourt9.webp", "/homepage.webp", "/homepage1.webp",
  "/homepage2.webp", "/homepage3.webp", "/homepage4.webp", "/homepage5.webp", "/homepage6.webp", "/homepage7.jpg",
  "/honeymoon1.webp", "/honeymoon2.webp", "/honeymoon3.webp", "/honeymoon4.webp", "/honeymoon5.webp", "/honeymoon6.webp",
  "/honeymoon7.webp", "/honeymoon8.webp", "/honeymoon9.webp", "/horse1.webp", "/horse2.webp", "/horseRiding.webp",
  "/hotSpring.webp", "/hotSpring2.webp", "/hunter1.webp", "/hunter2.webp", "/hunter3.webp", "/hunter4.webp",
  "/hunter5.webp", "/hunting.webp", "/hyena.webp", "/infinityPool.webp", "/infinityPool2.webp", "/into-the-wild-africa1.webp",
  "/into-the-wild-africa10.webp", "/into-the-wild-africa11.webp", "/into-the-wild-africa2.webp", "/into-the-wild-africa3.webp", "/into-the-wild-africa4.webp", "/into-the-wild-africa5.webp",
  "/into-the-wild-africa6.webp", "/into-the-wild-africa7.webp", "/into-the-wild-africa8.webp", "/into-the-wild-africa9.webp", "/inyati-safari-game-drive.webp", "/jacksons-spurfowl.webp",
  "/jambo1.webp", "/jambo10.webp", "/jambo11.webp", "/jambo12.webp", "/jambo13.webp", "/jambo14.webp",
  "/jambo2.webp", "/jambo3.webp", "/jambo4.webp", "/jambo5.webp", "/jambo6.webp", "/jambo7.webp",
  "/jambo8.webp", "/jambo9.webp", "/jock-safari-lodge-sundowners.webp", "/judmaier-campsite.webp", "/kampalaTour.webp", "/karamajong.webp",
  "/karla.webp", "/karuru-falls-aberdare.webp", "/kasubi-tombs.webp", "/kasubi-tombs2.webp", "/kayak.webp", "/kayak2.webp",
  "/kazinga.webp", "/ken1.webp", "/ken2.webp", "/ken3.webp", "/ken4.webp", "/ken5.webp",
  "/ken6.webp", "/kenya-flying-safari.webp", "/kenya-map.webp", "/kenyaDry1.webp", "/kenyaDry10.webp", "/kenyaDry11.webp",
  "/kenyaDry12.webp", "/kenyaDry13.webp", "/kenyaDry14.webp", "/kenyaDry15.webp", "/kenyaDry16.webp", "/kenyaDry17.webp",
  "/kenyaDry18.webp", "/kenyaDry19.webp", "/kenyaDry2.webp", "/kenyaDry20.webp", "/kenyaDry21.webp", "/kenyaDry22.webp",
  "/kenyaDry23.webp", "/kenyaDry24.webp", "/kenyaDry25.webp", "/kenyaDry3.webp", "/kenyaDry4.webp", "/kenyaDry5.webp",
  "/kenyaDry6.webp", "/kenyaDry7.webp", "/kenyaDry8.webp", "/kenyaDry9.webp", "/kenyaLuxury.webp", "/kenyaWet1.webp",
  "/kenyaWet10.webp", "/kenyaWet11.webp", "/kenyaWet12.webp", "/kenyaWet13.webp", "/kenyaWet14.webp", "/kenyaWet15.webp",
  "/kenyaWet16.webp", "/kenyaWet17.webp", "/kenyaWet18.webp", "/kenyaWet19.webp", "/kenyaWet2.webp", "/kenyaWet20.webp",
  "/kenyaWet21.webp", "/kenyaWet22.webp", "/kenyaWet23.webp", "/kenyaWet24.webp", "/kenyaWet25.webp", "/kenyaWet3.webp",
  "/kenyaWet4.webp", "/kenyaWet5.webp", "/kenyaWet6.webp", "/kenyaWet7.webp", "/kenyaWet8.webp", "/kenyaWet9.webp",
  "/kenyaWildlife1.webp", "/kenyaWildlife10.webp", "/kenyaWildlife11.webp", "/kenyaWildlife12.webp", "/kenyaWildlife13.webp", "/kenyaWildlife14.webp",
  "/kenyaWildlife15.webp", "/kenyaWildlife16.webp", "/kenyaWildlife17.webp", "/kenyaWildlife18.webp", "/kenyaWildlife19.webp", "/kenyaWildlife2.webp",
  "/kenyaWildlife20.webp", "/kenyaWildlife21.webp", "/kenyaWildlife22.webp", "/kenyaWildlife23.webp", "/kenyaWildlife24.webp", "/kenyaWildlife25.webp",
  "/kenyaWildlife26.webp", "/kenyaWildlife27.webp", "/kenyaWildlife28.webp", "/kenyaWildlife29.webp", "/kenyaWildlife3.webp", "/kenyaWildlife30.webp",
  "/kenyaWildlife31.webp", "/kenyaWildlife32.webp", "/kenyaWildlife33.webp", "/kenyaWildlife34.webp", "/kenyaWildlife35.webp", "/kenyaWildlife36.webp",
  "/kenyaWildlife37.webp", "/kenyaWildlife38.webp", "/kenyaWildlife39.webp", "/kenyaWildlife4.webp", "/kenyaWildlife40.webp", "/kenyaWildlife41.webp",
  "/kenyaWildlife42.webp", "/kenyaWildlife43.webp", "/kenyaWildlife44.webp", "/kenyaWildlife45.webp", "/kenyaWildlife46.webp", "/kenyaWildlife47.webp",
  "/kenyaWildlife48.webp", "/kenyaWildlife49.webp", "/kenyaWildlife5.webp", "/kenyaWildlife50.webp", "/kenyaWildlife6.webp", "/kenyaWildlife7.webp",
  "/kenyaWildlife8.webp", "/kenyaWildlife9.webp", "/Khao-Lak-Mangrove-Explorers.webp", "/kibale national.webp", "/kibaleForest.webp", "/kibale_national.webp",
  "/kichwa1.webp", "/kichwa10.webp", "/kichwa11.webp", "/kichwa12.webp", "/kichwa2.webp", "/kichwa3.webp",
  "/kichwa4.webp", "/kichwa5.webp", "/kichwa6.webp", "/kichwa7.webp", "/kichwa8.webp", "/kichwa9.webp",
  "/kigalitour.webp", "/kikuletwaHotSpring.webp", "/kilima1.webp", "/kilima10.webp", "/kilima11.webp", "/kilima2.webp",
  "/kilima3.webp", "/kilima4.webp", "/kilima5.webp", "/kilima6.webp", "/kilima7.webp", "/kilima8.webp",
  "/kilima9.webp", "/kilimaMoja1.webp", "/kilimaMoja10.webp", "/kilimaMoja11.webp", "/kilimaMoja2.webp", "/kilimaMoja3.webp",
  "/kilimaMoja4.webp", "/kilimaMoja5.webp", "/kilimaMoja6.webp", "/kilimaMoja7.webp", "/kilimaMoja8.webp", "/kilimaMoja9.webp",
  "/kilimanjaro.webp", "/kilimanjaroAirport.webp", "/kilimanjaroAirport1.webp", "/kings1.webp", "/kings2.webp", "/kings3.webp",
  "/kings4.webp", "/kings5.webp", "/kings6.webp", "/kings7.webp", "/kings8.webp", "/kings9.webp",
  "/kite-surfing.webp", "/kiteSurfing.webp", "/kituloPlateau.webp", "/kivu1.webp", "/kruger-national-park-south-africa-attraction-safari-trips.webp", "/Kruger-Safari-Game-Drive.webp",
  "/kruger.webp", "/kruger1.webp", "/kruger2.webp", "/kruger3.webp", "/kruger4.webp", "/krugerAdventure10.webp",
  "/krugerAdventure11.webp", "/krugerAdventure12.webp", "/krugerAdventure13.webp", "/krugerAdventure14.webp", "/krugerAdventure15.webp", "/krugerAdventure16.webp",
  "/krugerAdventure17.webp", "/krugerAdventure18.webp", "/krugerAdventure19.webp", "/krugerAdventure2.webp", "/krugerAdventure3.webp", "/krugerAdventure4.webp",
  "/krugerAdventure5.webp", "/krugerAdventure6.webp", "/krugerAdventure7.webp", "/krugerAdventure8.webp", "/krugerAdventure9.webp", "/krugerAdventures1.webp",
  "/lake naivasha.webp", "/Lake Nakuru.webp", "/Lake-Bunyonyi-1.webp", "/Lake-Bunyonyi-Tours.webp", "/Lake-Bunyonyis.webp", "/lake-kivu-adventure-scaled.webp",
  "/lake-nakuru-flamingos.webp", "/lakeBunyonyi.webp", "/lakeKivu1.webp", "/lakeKivu2.webp", "/lakeKivu3.webp", "/lakeManyara.webp",
  "/lakeMburo.webp", "/LakeNakuru1.webp", "/lakeNakuru10.webp", "/lakeNakuru11.webp", "/lakeNakuru12.webp", "/lakeNakuru13.webp",
  "/lakeNakuru14.webp", "/lakeNakuru15.webp", "/lakeNakuru16.webp", "/lakeNakuru17.webp", "/lakeNakuru2.webp", "/lakeNakuru3.webp",
  "/lakenakuru4.webp", "/lakenakuru5.webp", "/lakenakuru6.webp", "/lakeNakuru7.webp", "/lakeNakuru8.webp", "/lakeNakuru9.webp",
  "/lakeNatron.webp", "/lakeTurkana.webp", "/Lake_Kivu_Serena_Hotel_Beach.webp", "/lake_naivasha.webp", "/Lake_Nakuru.webp", "/Lamu - Copy.webp",
  "/Lamu.webp", "/landCruiser1.webp", "/landCruiser2.webp", "/landCruiser3.webp", "/landCruiser4.webp", "/landCruiser5.webp",
  "/Lenchada1.webp", "/Lenchada2.webp", "/Lenchada3.webp", "/Lenchada4.webp", "/Lenchada5.webp", "/Lenchada6.webp",
  "/leopard2.webp", "/leopard3.webp", "/leopard4.webp", "/leopard5.webp", "/leopard6.webp", "/leopard7.webp",
  "/leopardHills1.webp", "/leopardHills2.webp", "/leopardHills3.webp", "/leopardHills4.webp", "/leopardHills5.webp", "/leopardHills6.webp",
  "/leopardHills7.webp", "/leopardHills8.webp", "/leopardHills9.webp", "/lilac-breasted-roller.webp", "/lilac-breasted-roller2.webp", "/lion1.webp",
  "/lion10.webp", "/lion11.webp", "/lion12.webp", "/lion13.webp", "/lion14.webp", "/lion15.webp",
  "/lion16.webp", "/lion17.webp", "/lion18.webp", "/lion19.webp", "/lion2.webp", "/lion20.webp",
  "/lion21.webp", "/lion22.webp", "/lion23.webp", "/lion24.webp", "/lion25.webp", "/lion26.webp",
  "/lion27.webp", "/lion28.webp", "/lion29.webp", "/lion3.webp", "/lion4.webp", "/lion5.webp",
  "/lion6.webp", "/lion7.webp", "/lion8.webp", "/lion9.webp", "/lionHillLodge1.webp", "/lionHillLodge10.webp",
  "/lionHillLodge2.webp", "/lionHillLodge3.webp", "/lionHillLodge4.webp", "/lionHillLodge5.webp", "/lionHillLodge6.webp", "/lionHillLodge7.webp",
  "/lionHillLodge8.webp", "/lionHillLodge9.webp", "/lions.webp", "/lions1.webp", "/local-markets.webp", "/localBrews.webp",
  "/localVillages.webp", "/longNeck.webp", "/lunch.webp", "/luxury-safari-lodge.webp", "/luxury-spa-retreat.webp", "/luxury.webp",
  "/luxury2.webp", "/luxury3.webp", "/luxury4.webp", "/luxuryCamping.webp", "/luxuryTent.webp", "/luxuryUganda.webp",
  "/luxuryVolcanoes.webp", "/maasai mara.webp", "/maasai mara2.webp", "/maasai village.webp", "/maasai.webp", "/maasaiMara1.webp",
  "/maasaimara10.webp", "/maasaimara11.webp", "/maasaimara12.webp", "/maasaimara13.webp", "/maasaimara14.webp", "/maasaimara15.webp",
  "/maasaimara16.webp", "/maasaimara17.webp", "/maasaimara18.webp", "/maasaimara19.webp", "/maasaiMara2.webp", "/maasaimara20.webp",
  "/maasaimara21.webp", "/maasaimara22.webp", "/maasaimara23.webp", "/maasaimara24.webp", "/maasaimara25.webp", "/maasaimara26.webp",
  "/maasaimara27.webp", "/maasaimara28.webp", "/maasaimara29.webp", "/maasaimara3.webp", "/maasaimara30.webp", "/maasaimara31.webp",
  "/maasaimara32.webp", "/maasaimara33.webp", "/maasaimara34.webp", "/maasaimara4.webp", "/maasaimara5.webp", "/maasaimara6.webp",
  "/maasaimara7.webp", "/maasaimara8.webp", "/maasaimara9.webp", "/maasaimaraPlane.webp", "/maasaiVilage.webp", "/maasaiVillage.webp",
  "/maasaiVillage2.webp", "/maasaiVillage3.webp", "/maasaiVillage4.webp", "/maasaiVillage5.webp", "/maasaiVillage6.webp", "/maasai_mara2.webp",
  "/maasai_village.webp", "/maho1.webp", "/maho2.webp", "/maho3.webp", "/maho4.webp", "/maho5.webp",
  "/maho6.webp", "/maho7.webp", "/maho8.webp", "/maho9.webp", "/manjaro1.webp", "/manjaro2.webp",
  "/manjaro3.webp", "/manjaro4.webp", "/manjaro5.webp", "/manyara1.webp", "/manyara2.webp", "/manyara3.webp",
  "/marera-valley-lodge1.webp", "/marera-valley-lodge2.webp", "/marera-valley-lodge3.webp", "/marera-valley-lodge4.webp", "/marera-valley-lodge5.webp", "/marera-valley-lodge6.webp",
  "/marera-valley-lodge7.webp", "/marera-valley-lodge8.webp", "/marera-valley-lodge9.webp", "/marine-big-five.webp", "/market.webp", "/masaivilage2.webp",
  "/massage.webp", "/materuni-waterfalls-beautiful.webp", "/materuni1.webp", "/materuni10.webp", "/materuni11.webp", "/materuni12.webp",
  "/materuni13.webp", "/materuni14.webp", "/materuni15.webp", "/materuni2.webp", "/materuni3.webp", "/materuni4.webp",
  "/materuni5.webp", "/materuni6.webp", "/materuni7.webp", "/materuni8.webp", "/materuni9.webp", "/materuniFalls.webp",
  "/materuniFalls1.webp", "/materuniFalls2.webp", "/mawemawe1.webp", "/mawemawe10.webp", "/mawemawe2.webp", "/mawemawe3.webp",
  "/mawemawe4.webp", "/mawemawe5.webp", "/mawemawe6.webp", "/mawemawe7.webp", "/mawemawe8.webp", "/mawemawe9.webp",
  "/mburo.webp", "/melia1.webp", "/melia10.webp", "/melia11.webp", "/melia12.webp", "/melia13.webp",
  "/melia14.webp", "/melia15.webp", "/melia2.webp", "/melia3.webp", "/melia4.webp", "/melia5.webp",
  "/melia6.webp", "/melia7.webp", "/melia8.webp", "/melia9.webp", "/meliaArusha1.webp", "/meliaArusha10.webp",
  "/meliaArusha11.webp", "/meliaArusha12.webp", "/meliaArusha13.webp", "/meliaArusha14.webp", "/meliaArusha15.webp", "/meliaArusha16.webp",
  "/meliaArusha2.webp", "/meliaArusha3.webp", "/meliaArusha4.webp", "/meliaArusha5.webp", "/meliaArusha6.webp", "/meliaArusha7.webp",
  "/meliaArusha8.webp", "/meliaArusha9.webp", "/meru1.webp", "/meru2.webp", "/meru3.webp", "/meru4.webp",
  "/migombani1.webp", "/migombani2.webp", "/migombani3.webp", "/migombani4.webp", "/migombani5.webp", "/migombani6.webp",
  "/migration.jpg", "/migration.webp", "/Mihingo-Lodge.webp", "/mihingo1.webp", "/mihingo2.webp", "/mihingo3.webp",
  "/mihingo4.webp", "/mihingo5.webp", "/mihingo6.webp", "/mihingo7.webp", "/mikumi.webp", "/mikumi2.webp",
  "/mikumi3.webp", "/mlokaSafariLodge1.webp", "/mlokaSafariLodge10.webp", "/mlokaSafariLodge11.webp", "/mlokaSafariLodge12.webp", "/mlokaSafariLodge13.webp",
  "/mlokaSafariLodge14.webp", "/mlokaSafariLodge15.webp", "/mlokaSafariLodge16.webp", "/mlokaSafariLodge2.webp", "/mlokaSafariLodge3.webp", "/mlokaSafariLodge4.webp",
  "/mlokaSafariLodge5.webp", "/mlokaSafariLodge6.webp", "/mlokaSafariLodge7.webp", "/mlokaSafariLodge8.webp", "/mlokaSafariLodge9.webp", "/mombasa1.webp",
  "/mombasa10.webp", "/mombasa2.webp", "/mombasa3.webp", "/mombasa4.webp", "/mombasa5.webp", "/mombasa6.webp",
  "/mombasa7.webp", "/mombasa8.webp", "/mombasa9.webp", "/moorland-chat.webp", "/mountBisoke.webp", "/mountKenya.webp",
  "/mountKenya2.webp", "/mountMeru.webp", "/moyo-tented-camp1.webp", "/moyo-tented-camp10.webp", "/moyo-tented-camp11.webp", "/moyo-tented-camp2.webp",
  "/moyo-tented-camp3.webp", "/moyo-tented-camp4.webp", "/moyo-tented-camp5.webp", "/moyo-tented-camp6.webp", "/moyo-tented-camp7.webp", "/moyo-tented-camp8.webp",
  "/moyo-tented-camp9.webp", "/mtowaumbu.webp", "/mtwapaCreek1.webp", "/murchison falls.webp", "/murchison falls2.webp", "/murchisonFall.webp",
  "/murchisonFall2.webp", "/murchisonFall3.webp", "/murchisonfalls3.webp", "/murchison_falls.webp", "/murchison_falls2.webp", "/murchson.webp",
  "/muurchisonFalls.webp", "/mweya1.webp", "/mweya2.webp", "/mweya3.webp", "/mweya4.webp", "/mweya5.webp",
  "/mweya6.webp", "/mweya7.webp", "/nairobiMuseum.webp", "/nanyukieLodge1.webp", "/nanyukieLodge2.webp", "/nanyukieLodge3.webp",
  "/nanyukieLodge4.webp", "/nanyukieLodge5.webp", "/nanyukieLodge6.webp", "/nanyukieLodge7.webp", "/nanyukieLodge8.webp", "/nasikia1.webp",
  "/nasikia10.webp", "/nasikia11.webp", "/nasikia2.webp", "/nasikia3.webp", "/nasikia4.webp", "/nasikia5.webp",
  "/nasikia6.webp", "/nasikia7.webp", "/nasikia8.webp", "/nasikia9.webp", "/ndere-cultural-center-uganda.webp", "/ngoro1.webp",
  "/ngoro2.webp", "/ngoro3.webp", "/ngoro4.webp", "/ngoro5.webp", "/ngoro6.webp", "/ngoro7.webp",
  "/ngorongoro-Marera-mountain-view1.webp", "/ngorongoro-Marera-mountain-view2.webp", "/ngorongoro-Marera-mountain-view3.webp", "/ngorongoro-Marera-mountain-view4.webp", "/ngorongoro-Marera-mountain-view5.webp", "/ngorongoro-Marera-mountain-view6.webp",
  "/ngorongoro-Marera-mountain-view7.webp", "/ngorongoro-Marera-mountain-view8.webp", "/ngorongoro-Marera-mountain-view9.webp", "/ngorongoro.webp", "/ngorongoro1.webp", "/ngorongoro10.webp",
  "/ngorongoro11.webp", "/ngorongoro12.webp", "/ngorongoro13.webp", "/ngorongoro14.webp", "/ngorongoro15.webp", "/ngorongoro2.webp",
  "/ngorongoro3.webp", "/ngorongoro4.webp", "/ngorongoro5.webp", "/ngorongoro6.webp", "/ngorongoro7.webp", "/ngorongoro8.webp",
  "/ngorongoro9.webp", "/ngorongoroHiking.webp", "/ngorongoroMelia1.webp", "/ngorongoroMelia10.webp", "/ngorongoroMelia11.webp", "/ngorongoroMelia12.webp",
  "/ngorongoroMelia13.webp", "/ngorongoroMelia14.webp", "/ngorongoroMelia15.webp", "/ngorongoroMelia16.webp", "/ngorongoroMelia2.webp", "/ngorongoroMelia3.webp",
  "/ngorongoroMelia4.webp", "/ngorongoroMelia5.webp", "/ngorongoroMelia6.webp", "/ngorongoroMelia7.webp", "/ngorongoroMelia8.webp", "/ngorongoroMelia9.webp",
  "/ngorongoroSerena1.webp", "/ngorongoroSerena10.webp", "/ngorongoroSerena11.webp", "/ngorongoroSerena12.webp", "/ngorongoroSerena13.webp", "/ngorongoroSerena14.webp",
  "/ngorongoroSerena2.webp", "/ngorongoroSerena3.webp", "/ngorongoroSerena4.webp", "/ngorongoroSerena5.webp", "/ngorongoroSerena6.webp", "/ngorongoroSerena7.webp",
  "/ngorongoroSerena8.webp", "/ngorongoroSerena9.webp", "/ngulia-safari-lodge1.webp", "/ngulia-safari-lodge2.webp", "/ngulia-safari-lodge3.webp", "/ngulia-safari-lodge4.webp",
  "/ngulia-safari-lodge5.webp", "/ngulia-safari-lodge6.webp", "/ngulia-safari-lodge7.webp", "/Nightlife-Experience-in-Kampala.webp", "/nightSafari.webp", "/nightSafari2.webp",
  "/nyati-safari-camp1.webp", "/nyati-safari-camp10.webp", "/nyati-safari-camp11.webp", "/nyati-safari-camp2.webp", "/nyati-safari-camp3.webp", "/nyati-safari-camp4.webp",
  "/nyati-safari-camp5.webp", "/nyati-safari-camp6.webp", "/nyati-safari-camp7.webp", "/nyati-safari-camp8.webp", "/nyati-safari-camp9.webp", "/nyerere.webp",
  "/nyerere2.webp", "/nyerere3.webp", "/nyungwe1.webp", "/OldoinyoLengaiHike.webp", "/olPejeta1.webp", "/olPejeta2.webp",
  "/oltukai1.webp", "/oltukai2.webp", "/oltukai3.webp", "/oltukai4.webp", "/oltukai5.webp", "/oltukai6.webp",
  "/ostrich-farm-oudtshoorn.webp", "/otter-trail-late-afternoon-coast.webp", "/panorama.webp", "/panorama2..webp", "/paraa1.webp", "/paraa10.webp",
  "/paraa2.webp", "/paraa3.webp", "/paraa4.webp", "/paraa5.webp", "/paraa6.webp", "/paraa7.webp",
  "/paraa8.webp", "/paraa9.webp", "/paragliding.webp", "/parkside1.webp", "/parkside2.webp", "/parkside3.webp",
  "/parkside4.webp", "/parkside5.webp", "/parkside6.webp", "/parkside7.webp", "/penety-amboseli-resort1.webp", "/penety-amboseli-resort10.webp",
  "/penety-amboseli-resort11.webp", "/penety-amboseli-resort12.webp", "/penety-amboseli-resort2.webp", "/penety-amboseli-resort3.webp", "/penety-amboseli-resort4.webp", "/penety-amboseli-resort5.webp",
  "/penety-amboseli-resort6.webp", "/penety-amboseli-resort7.webp", "/penety-amboseli-resort8.webp", "/penety-amboseli-resort9.webp", "/photographicSafari.webp", "/photographicSafari2.webp",
  "/photographicSafari3.webp", "/photographicSafari4.webp", "/pian-upe-wildlife-reserve.webp", "/pied-crow.webp", "/plane1.webp", "/plane2.webp",
  "/plane3.webp", "/plane4.webp", "/plane5.webp", "/planeSerengeti.webp", "/pride1.webp", "/prisonIsland.webp",
  "/private-photography-guide.webp", "/private-yacht-cruise.webp", "/privateHelicopter.jfif", "/quadBike.webp", "/quadBike2.webp", "/queenelizabeth.webp",
  "/queenelizabeth2.webp", "/queenelizabeth3.webp", "/queenElizabeth4.webp", "/rafting.webp", "/rare.webp", "/rare2.webp",
  "/red-billed-quelea.webp", "/red-elephant-lodge1.webp", "/red-elephant-lodge2.webp", "/red-elephant-lodge3.webp", "/red-elephant-lodge4.webp", "/red-elephant-lodge5.webp",
  "/red-elephant-lodge6.webp", "/red-elephant-lodge7.webp", "/red-winged-starling.webp", "/red-yellow-barbe.webp", "/Rhino-tracking-on-foot.webp", "/rhino-tracking.webp",
  "/rhino.webp", "/rhino2.webp", "/rhino3.webp", "/riftValley.webp", "/robben-island.webp", "/rockClimbing.webp",
  "/ruaha-hilltop-lodge1.webp", "/ruaha-hilltop-lodge2.webp", "/ruaha-hilltop-lodge3.webp", "/ruaha-hilltop-lodge4.webp", "/ruaha-hilltop-lodge5.webp", "/ruaha-hilltop-lodge6.webp",
  "/ruaha-hilltop-lodge7.webp", "/ruaha-hilltop-lodge8.webp", "/ruaha1.webp", "/ruaha2.webp", "/Rusumo-Waterfall.webp", "/RusumoFalls2.webp",
  "/Rwanda-Congo-Nile-Trail-Lake-Kivu.webp", "/rwanda-feature.webp", "/rwanda-map.webp", "/rwandaDry1.webp", "/rwandaDry10.webp", "/rwandaDry11.webp",
  "/rwandaDry12.webp", "/rwandaDry13.webp", "/rwandaDry14.webp", "/rwandaDry15.webp", "/rwandaDry16.webp", "/rwandaDry17.webp",
  "/rwandaDry18.webp", "/rwandaDry19.webp", "/rwandaDry2.webp", "/rwandaDry20.webp", "/rwandaDry3.webp", "/rwandaDry4.webp",
  "/rwandaDry5.webp", "/rwandaDry6.webp", "/rwandaDry7.webp", "/rwandaDry8.webp", "/rwandaDry9.webp", "/rwandaWet1.webp",
  "/rwandaWet10.webp", "/rwandaWet11.webp", "/rwandaWet12.webp", "/rwandaWet13.webp", "/rwandaWet14.webp", "/rwandaWet15.webp",
  "/rwandaWet16.webp", "/rwandaWet17.webp", "/rwandaWet18.webp", "/rwandaWet19.webp", "/rwandaWet2.webp", "/rwandaWet20.webp",
  "/rwandaWet21.webp", "/rwandaWet22.webp", "/rwandaWet23.webp", "/rwandaWet24.webp", "/rwandaWet25.webp", "/rwandaWet3.webp",
  "/rwandaWet4.webp", "/rwandaWet5.webp", "/rwandaWet6.webp", "/rwandaWet7.webp", "/rwandaWet8.webp", "/rwandaWet9.webp",
  "/rwandaWildlife1.webp", "/rwandaWildlife10.webp", "/rwandaWildlife100.webp", "/rwandaWildlife11.webp", "/rwandaWildlife12.webp", "/rwandaWildlife13.webp",
  "/rwandaWildlife14.webp", "/rwandaWildlife15.webp", "/rwandaWildlife16.webp", "/rwandaWildlife17.webp", "/rwandaWildlife18.webp", "/rwandaWildlife19.webp",
  "/rwandaWildlife2.webp", "/rwandaWildlife20.webp", "/rwandaWildlife21.webp", "/rwandaWildlife22.webp", "/rwandaWildlife23.webp", "/rwandaWildlife24.webp",
  "/rwandaWildlife25.webp", "/rwandaWildlife26.webp", "/rwandaWildlife27.webp", "/rwandaWildlife28.webp", "/rwandaWildlife29.webp", "/rwandaWildlife3.webp",
  "/rwandaWildlife30.webp", "/rwandaWildlife31.webp", "/rwandaWildlife32.webp", "/rwandaWildlife33.webp", "/rwandaWildlife34.webp", "/rwandaWildlife35.webp",
  "/rwandaWildlife36.webp", "/rwandaWildlife37.webp", "/rwandaWildlife38.webp", "/rwandaWildlife39.webp", "/rwandaWildlife4.webp", "/rwandaWildlife40.webp",
  "/rwandaWildlife41.webp", "/rwandaWildlife42.webp", "/rwandaWildlife43.webp", "/rwandaWildlife44.webp", "/rwandaWildlife45.webp", "/rwandaWildlife46.webp",
  "/rwandaWildlife47.webp", "/rwandaWildlife48.webp", "/rwandaWildlife49.webp", "/rwandaWildlife5.webp", "/rwandaWildlife50.webp", "/rwandaWildlife51.webp",
  "/rwandaWildlife52.webp", "/rwandaWildlife53.webp", "/rwandaWildlife54.webp", "/rwandaWildlife55.webp", "/rwandaWildlife56.webp", "/rwandaWildlife57.webp",
  "/rwandaWildlife58.webp", "/rwandaWildlife59.webp", "/rwandaWildlife6.webp", "/rwandaWildlife60.webp", "/rwandaWildlife61.webp", "/rwandaWildlife62.webp",
  "/rwandaWildlife63.webp", "/rwandaWildlife64.webp", "/rwandaWildlife65.webp", "/rwandaWildlife66.webp", "/rwandaWildlife67.webp", "/rwandaWildlife68.webp",
  "/rwandaWildlife69.webp", "/rwandaWildlife7.webp", "/rwandaWildlife70.webp", "/rwandaWildlife71.webp", "/rwandaWildlife72.webp", "/rwandaWildlife73.webp",
  "/rwandaWildlife74.webp", "/rwandaWildlife75.webp", "/rwandaWildlife76.webp", "/rwandaWildlife77.webp", "/rwandaWildlife78.webp", "/rwandaWildlife79.webp",
  "/rwandaWildlife8.webp", "/rwandaWildlife80.webp", "/rwandaWildlife81.webp", "/rwandaWildlife82.webp", "/rwandaWildlife83.webp", "/rwandaWildlife84.webp",
  "/rwandaWildlife85.webp", "/rwandaWildlife86.webp", "/rwandaWildlife87.webp", "/rwandaWildlife88.webp", "/rwandaWildlife89.webp", "/rwandaWildlife9.webp",
  "/rwandaWildlife90.webp", "/rwandaWildlife91.webp", "/rwandaWildlife92.webp", "/rwandaWildlife93.webp", "/rwandaWildlife94.webp", "/rwandaWildlife95.webp",
  "/rwandaWildlife96.webp", "/rwandaWildlife97.webp", "/rwandaWildlife98.webp", "/rwandaWildlife99.webp", "/rwiza1.webp", "/rwiza2.webp",
  "/rwiza3.webp", "/rwiza4.webp", "/rwiza5.webp", "/rwiza6.webp", "/rwiza7.webp", "/sabisabi.webp",
  "/safari-erlebnisse-kenia.webp", "/safariElephants.webp", "/safariElephants2.webp", "/safariElephants3.webp", "/safariElephants4.webp", "/safariElephants5.webp",
  "/safariElephants6.webp", "/safariLions.webp", "/safariWalk.webp", "/saltLickSafariLodge1.webp", "/saltLickSafariLodge2.webp", "/saltLickSafariLodge3.webp",
  "/saltLickSafariLodge4.webp", "/saltLickSafariLodge5.webp", "/saltLickSafariLodge6.webp", "/saltLickSafariLodge7.webp", "/saltLickSafariLodge8.webp", "/samburu1.webp",
  "/samburu2.webp", "/samburu3.webp", "/samburuNational1.webp", "/samburuNational2.webp", "/sandRiver1.webp", "/sandRiver10.webp",
  "/sandRiver11.webp", "/sandRiver12.webp", "/sandRiver13.webp", "/sandRiver14.webp", "/sandRiver15.webp", "/sandRiver16.webp",
  "/sandRiver17.webp", "/sandRiver18.webp", "/sandRiver19.webp", "/sandRiver2.webp", "/sandRiver20.webp", "/sandRiver21.webp",
  "/sandRiver22.webp", "/sandRiver23.webp", "/sandRiver24.webp", "/sandRiver25.webp", "/sandRiver26.webp", "/sandRiver27.webp",
  "/sandRiver28.webp", "/sandRiver3.webp", "/sandRiver4.webp", "/sandRiver5.webp", "/sandRiver6.webp", "/sandRiver7.webp",
  "/sandRiver8.webp", "/sandRiver9.webp", "/sarova1.webp", "/sarova2.webp", "/sarova3.webp", "/sarova4.webp",
  "/sarova5.webp", "/sarova6.webp", "/sarova7.webp", "/sarovamara1.webp", "/sarovamara2.webp", "/sarovamara3.webp",
  "/sarovamara4.webp", "/sarovamara5.webp", "/sarovamara6.webp", "/SarovaWoodLands1.webp", "/SarovaWoodLands2.webp", "/SarovaWoodLands3.webp",
  "/SarovaWoodLands4.webp", "/SarovaWoodLands5.webp", "/SarovaWoodLands6.webp", "/SarovaWoodLands7.webp", "/SarovaWoodLands8.webp", "/sasaab1.webp",
  "/sasaab2.webp", "/sasaab3.webp", "/sasaab4.webp", "/sasaab5.webp", "/sasaab6.webp", "/sasaab7.webp",
  "/scarlet-chested-sunbird.webp", "/scarlet-chested-sunbird2.webp", "/scarlet-chested-sunbird3.webp", "/selfDrive.webp", "/selous1.webp", "/selous2.webp",
  "/selous3.webp", "/selous4.webp", "/selous5.webp", "/selous6.webp", "/semuliki-national-park.webp", "/serenaSerengeti1.webp",
  "/serenaSerengeti10.webp", "/serenaSerengeti11.webp", "/serenaSerengeti12.webp", "/serenaSerengeti13.webp", "/serenaSerengeti14.webp", "/serenaSerengeti15.webp",
  "/serenaSerengeti16.webp", "/serenaSerengeti17.webp", "/serenaSerengeti18.webp", "/serenaSerengeti19.webp", "/serenaSerengeti2.webp", "/serenaSerengeti20.webp",
  "/serenaSerengeti21.webp", "/serenaSerengeti3.webp", "/serenaSerengeti4.webp", "/serenaSerengeti5.webp", "/serenaSerengeti6.webp", "/serenaSerengeti7.webp",
  "/serenaSerengeti8.webp", "/serenaSerengeti9.webp", "/serenaZanzibar1.webp", "/serenaZanzibar10.webp", "/serenaZanzibar11.webp", "/serenaZanzibar12.webp",
  "/serenaZanzibar13.webp", "/serenaZanzibar14.webp", "/serenaZanzibar15.webp", "/serenaZanzibar2.webp", "/serenaZanzibar3.webp", "/serenaZanzibar4.webp",
  "/serenaZanzibar5.webp", "/serenaZanzibar6.webp", "/serenaZanzibar7.webp", "/serenaZanzibar8.webp", "/serenaZanzibar9.webp", "/serengeti-budget.webp",
  "/serengeti-budget2.webp", "/serengeti-tanzania-bush1.webp", "/serengeti-tanzania-bush10.webp", "/serengeti-tanzania-bush11.webp", "/serengeti-tanzania-bush12.webp", "/serengeti-tanzania-bush13.webp",
  "/serengeti-tanzania-bush14.webp", "/serengeti-tanzania-bush15.webp", "/serengeti-tanzania-bush16.webp", "/serengeti-tanzania-bush2.webp", "/serengeti-tanzania-bush3.webp", "/serengeti-tanzania-bush4.webp",
  "/serengeti-tanzania-bush5.webp", "/serengeti-tanzania-bush6.webp", "/serengeti-tanzania-bush7.webp", "/serengeti-tanzania-bush8.webp", "/serengeti-tanzania-bush9.webp", "/serengeti.webp",
  "/serengeti1.webp", "/serengeti10.webp", "/serengeti11.webp", "/serengeti12.webp", "/serengeti13.webp", "/serengeti14.webp",
  "/serengeti15.webp", "/serengeti16.webp", "/serengeti2.webp", "/serengeti3.webp", "/serengeti4.webp", "/serengeti5.webp",
  "/serengeti6.webp", "/serengeti7.webp", "/serengeti8.webp", "/serengeti9.webp", "/seronaValley.webp", "/seroneraCampingsite1.webp",
  "/seroneraCampsite2.webp", "/seroneraCampsite3.webp", "/seroneraCampsite4.webp", "/seroneraCampsite5.webp", "/seroneraCampsite6.webp", "/severin1.webp",
  "/severin2.webp", "/severin3.webp", "/severin4.webp", "/severin5.webp", "/severin6.webp", "/severin7.webp",
  "/shark-diving-2-days.webp", "/shimba1.webp", "/shiptons1.webp", "/shiptons2.webp", "/shiptons3.webp", "/shiptons4.webp",
  "/shiptons5.webp", "/shiptons6.webp", "/shoebill-stork.webp", "/Shoebill-tracking-In-Mabamba-Swamp.webp", "/simbaCampsite1.webp", "/simbaCampsite2.webp",
  "/simbaCampsite3.webp", "/simbaCampsite4.webp", "/simbaCampsite5.webp", "/simbaCampsite6.webp", "/Sipi-Falls-Uganda.webp", "/sipiFalls.webp",
  "/snokering.webp", "/snokering2.webp", "/snokering3.webp", "/solio1.webp", "/solio10.webp", "/solio2.webp",
  "/solio3.webp", "/solio4.webp", "/solio5.webp", "/solio6.webp", "/solio7.webp", "/solio8.webp",
  "/solio9.webp", "/sopa 11.webp", "/sopa 12.webp", "/sopa 13.webp", "/sopa 15.webp", "/sopa 16.webp",
  "/sopa 17.webp", "/sopa 4.webp", "/sopa 6.webp", "/sopa1.webp", "/sopa10.webp", "/sopa2.webp",
  "/sopa3.webp", "/sopa5.webp", "/sopa7.webp", "/sopa8.webp", "/sopa9.webp", "/sopa_11.webp",
  "/sopa_12.webp", "/sopa_13.webp", "/sopa_15.webp", "/sopa_16.webp", "/sopa_17.webp", "/sopa_4.webp",
  "/sopa_6.webp", "/southafrica-map.webp", "/southAfricaWildlife1.webp", "/southAfricaWildlife10.webp", "/southAfricaWildlife100.webp", "/southAfricaWildlife11.webp",
  "/southAfricaWildlife12.webp", "/southAfricaWildlife13.webp", "/southAfricaWildlife14.webp", "/southAfricaWildlife15.webp", "/southAfricaWildlife16.webp", "/southAfricaWildlife17.webp",
  "/southAfricaWildlife18.webp", "/southAfricaWildlife19.webp", "/southAfricaWildlife2.webp", "/southAfricaWildlife20.webp", "/southAfricaWildlife21.webp", "/southAfricaWildlife22.webp",
  "/southAfricaWildlife23.webp", "/southAfricaWildlife24.webp", "/southAfricaWildlife25.webp", "/southAfricaWildlife26.webp", "/southAfricaWildlife27.webp", "/southAfricaWildlife28.webp",
  "/southAfricaWildlife29.webp", "/southAfricaWildlife3.webp", "/southAfricaWildlife30.webp", "/southAfricaWildlife31.webp", "/southAfricaWildlife32.webp", "/southAfricaWildlife33.webp",
  "/southAfricaWildlife34.webp", "/southAfricaWildlife35.webp", "/southAfricaWildlife36.webp", "/southAfricaWildlife37.webp", "/southAfricaWildlife38.webp", "/southAfricaWildlife39.webp",
  "/southAfricaWildlife4.webp", "/southAfricaWildlife40.webp", "/southAfricaWildlife41.webp", "/southAfricaWildlife42.webp", "/southAfricaWildlife43.webp", "/southAfricaWildlife44.webp",
  "/southAfricaWildlife45.webp", "/southAfricaWildlife46.webp", "/southAfricaWildlife47.webp", "/southAfricaWildlife48.webp", "/southAfricaWildlife49.webp", "/southAfricaWildlife5.webp",
  "/southAfricaWildlife50.webp", "/southAfricaWildlife51.webp", "/southAfricaWildlife52.webp", "/southAfricaWildlife53.webp", "/southAfricaWildlife54.webp", "/southAfricaWildlife55.webp",
  "/southAfricaWildlife56.webp", "/southAfricaWildlife57.webp", "/southAfricaWildlife58.webp", "/southAfricaWildlife59.webp", "/southAfricaWildlife6.webp", "/southAfricaWildlife60.webp",
  "/southAfricaWildlife61.webp", "/southAfricaWildlife62.webp", "/southAfricaWildlife63.webp", "/southAfricaWildlife64.webp", "/southAfricaWildlife65.webp", "/southAfricaWildlife66.webp",
  "/southAfricaWildlife67.webp", "/southAfricaWildlife68.webp", "/southAfricaWildlife69.webp", "/southAfricaWildlife7.webp", "/southAfricaWildlife70.webp", "/southAfricaWildlife71.webp",
  "/southAfricaWildlife72.webp", "/southAfricaWildlife73.webp", "/southAfricaWildlife74.webp", "/southAfricaWildlife75.webp", "/southAfricaWildlife76.webp", "/southAfricaWildlife77.webp",
  "/southAfricaWildlife78.webp", "/southAfricaWildlife79.webp", "/southAfricaWildlife8.webp", "/southAfricaWildlife80.webp", "/southAfricaWildlife81.webp", "/southAfricaWildlife82.webp",
  "/southAfricaWildlife83.webp", "/southAfricaWildlife84.webp", "/southAfricaWildlife85.webp", "/southAfricaWildlife86.webp", "/southAfricaWildlife87.webp", "/southAfricaWildlife88.webp",
  "/southAfricaWildlife89.webp", "/southAfricaWildlife9.webp", "/southAfricaWildlife90.webp", "/southAfricaWildlife91.webp", "/southAfricaWildlife92.webp", "/southAfricaWildlife93.webp",
  "/southAfricaWildlife94.webp", "/southAfricaWildlife95.webp", "/southAfricaWildlife96.webp", "/southAfricaWildlife97.webp", "/southAfricaWildlife98.webp", "/southAfricaWildlife99.webp",
  "/southAfricaWildlifeDry1.webp", "/southAfricaWildlifeDry10.webp", "/southAfricaWildlifeDry11.webp", "/southAfricaWildlifeDry12.webp", "/southAfricaWildlifeDry13.webp", "/southAfricaWildlifeDry14.webp",
  "/southAfricaWildlifeDry15.webp", "/southAfricaWildlifeDry16.webp", "/southAfricaWildlifeDry17.webp", "/southAfricaWildlifeDry18.webp", "/southAfricaWildlifeDry19.webp", "/southAfricaWildlifeDry2.webp",
  "/southAfricaWildlifeDry20.webp", "/southAfricaWildlifeDry21.webp", "/southAfricaWildlifeDry22.webp", "/southAfricaWildlifeDry23.webp", "/southAfricaWildlifeDry24.webp", "/southAfricaWildlifeDry25.webp",
  "/southAfricaWildlifeDry26.webp", "/southAfricaWildlifeDry27.webp", "/southAfricaWildlifeDry28.webp", "/southAfricaWildlifeDry29.webp", "/southAfricaWildlifeDry3.webp", "/southAfricaWildlifeDry30.webp",
  "/southAfricaWildlifeDry31.webp", "/southAfricaWildlifeDry32.webp", "/southAfricaWildlifeDry33.webp", "/southAfricaWildlifeDry34.webp", "/southAfricaWildlifeDry35.webp", "/southAfricaWildlifeDry36.webp",
  "/southAfricaWildlifeDry37.webp", "/southAfricaWildlifeDry38.webp", "/southAfricaWildlifeDry39.webp", "/southAfricaWildlifeDry4.webp", "/southAfricaWildlifeDry40.webp", "/southAfricaWildlifeDry41.webp",
  "/southAfricaWildlifeDry42.webp", "/southAfricaWildlifeDry43.webp", "/southAfricaWildlifeDry44.webp", "/southAfricaWildlifeDry45.webp", "/southAfricaWildlifeDry46.webp", "/southAfricaWildlifeDry47.webp",
  "/southAfricaWildlifeDry48.webp", "/southAfricaWildlifeDry49.webp", "/southAfricaWildlifeDry5.webp", "/southAfricaWildlifeDry50.webp", "/southAfricaWildlifeDry6.webp", "/southAfricaWildlifeDry7.webp",
  "/southAfricaWildlifeDry8.webp", "/southAfricaWildlifeDry9.webp", "/southAfricaWildlifeWet1.webp", "/southAfricaWildlifeWet10.webp", "/southAfricaWildlifeWet11.webp", "/southAfricaWildlifeWet12.webp",
  "/southAfricaWildlifeWet13.webp", "/southAfricaWildlifeWet14.webp", "/southAfricaWildlifeWet15.webp", "/southAfricaWildlifeWet16.webp", "/southAfricaWildlifeWet17.webp", "/southAfricaWildlifeWet18.webp",
  "/southAfricaWildlifeWet19.webp", "/southAfricaWildlifeWet2.webp", "/southAfricaWildlifeWet20.webp", "/southAfricaWildlifeWet21.webp", "/southAfricaWildlifeWet22.webp", "/southAfricaWildlifeWet23.webp",
  "/southAfricaWildlifeWet24.webp", "/southAfricaWildlifeWet25.webp", "/southAfricaWildlifeWet26.webp", "/southAfricaWildlifeWet27.webp", "/southAfricaWildlifeWet28.webp", "/southAfricaWildlifeWet29.webp",
  "/southAfricaWildlifeWet3.webp", "/southAfricaWildlifeWet30.webp", "/southAfricaWildlifeWet31.webp", "/southAfricaWildlifeWet32.webp", "/southAfricaWildlifeWet33.webp", "/southAfricaWildlifeWet34.webp",
  "/southAfricaWildlifeWet35.webp", "/southAfricaWildlifeWet36.webp", "/southAfricaWildlifeWet37.webp", "/southAfricaWildlifeWet38.webp", "/southAfricaWildlifeWet39.webp", "/southAfricaWildlifeWet4.webp",
  "/southAfricaWildlifeWet40.webp", "/southAfricaWildlifeWet5.webp", "/southAfricaWildlifeWet6.webp", "/southAfricaWildlifeWet7.webp", "/southAfricaWildlifeWet8.webp", "/southAfricaWildlifeWet9.webp",
  "/southern-ground-hornbill.webp", "/southern-ground-hornbill2.webp", "/southern-ground-hornbill3.webp", "/spa-safaris.webp", "/spiceTour.webp", "/spiritualHeritageKampala.webp",
  "/sportFishing.webp", "/Ssese-honeymoon.webp", "/stellenbosch-wine.webp", "/stoneTown.webp", "/storyTelling.webp", "/storyTelling2.webp",
  "/summitSafari1.webp", "/summitSafari10.webp", "/summitSafari11.webp", "/summitSafari12.webp", "/summitSafari13.webp", "/summitSafari14.webp",
  "/summitSafari15.webp", "/summitSafari16.webp", "/summitSafari17.webp", "/summitSafari18.webp", "/summitSafari19.webp", "/summitSafari2.webp",
  "/summitSafari20.webp", "/summitSafari21.webp", "/summitSafari22.webp", "/summitSafari23.webp", "/summitSafari3.webp", "/summitSafari4.webp",
  "/summitSafari5.webp", "/summitSafari6.webp", "/summitSafari7.webp", "/summitSafari8.webp", "/summitSafari9.webp", "/sundowner.webp",
  "/sundowner2.webp", "/sunrise.webp", "/sunset-drum-circle-stockcake.webp", "/sunset-safari-dinner.webp", "/sunset1.webp", "/sunset2.webp",
  "/sunset3.webp", "/sunset4.webp", "/sunset5.webp", "/sunset6.webp", "/sunset7.webp", "/sunset8.webp",
  "/superb-starling.webp", "/surfing.webp", "/sweetwaters-serena-camp1.webp", "/sweetwaters-serena-camp10.webp", "/sweetwaters-serena-camp11.webp", "/sweetwaters-serena-camp12.webp",
  "/sweetwaters-serena-camp13.webp", "/sweetwaters-serena-camp14.webp", "/sweetwaters-serena-camp15.webp", "/sweetwaters-serena-camp16.webp", "/sweetwaters-serena-camp17.webp", "/sweetwaters-serena-camp18.webp",
  "/sweetwaters-serena-camp19.webp", "/sweetwaters-serena-camp2.webp", "/sweetwaters-serena-camp20.webp", "/sweetwaters-serena-camp21.webp", "/sweetwaters-serena-camp22.webp", "/sweetwaters-serena-camp23.webp",
  "/sweetwaters-serena-camp24.webp", "/sweetwaters-serena-camp25.webp", "/sweetwaters-serena-camp3.webp", "/sweetwaters-serena-camp4.webp", "/sweetwaters-serena-camp5.webp", "/sweetwaters-serena-camp6.webp",
  "/sweetwaters-serena-camp7.webp", "/sweetwaters-serena-camp8.webp", "/sweetwaters-serena-camp9.webp", "/sweetwaters1.webp", "/sweetwaters2.webp", "/sweetwaters3.webp",
  "/sweetwaters4.webp", "/sweetwaters5.webp", "/sweetwaters6.webp", "/swiming.webp", "/sword1.webp", "/sword2.webp",
  "/sword3.webp", "/sword4.webp", "/sword5.webp", "/TableMountainAerialCableway2018.webp", "/tanapa-ruaha-bandas.webp", "/tanapaRuahaCottages1.webp",
  "/tanapaRuahaCottages2.webp", "/tanzania-map.webp", "/tanzania.webp", "/tanzaniaDry1.webp", "/tanzaniaDry10.webp", "/tanzaniaDry11.webp",
  "/tanzaniaDry12.webp", "/tanzaniaDry13.webp", "/tanzaniaDry14.webp", "/tanzaniaDry15.webp", "/tanzaniaDry16.webp", "/tanzaniaDry17.webp",
  "/tanzaniaDry18.webp", "/tanzaniaDry19.webp", "/tanzaniaDry2.webp", "/tanzaniaDry20.webp", "/tanzaniaDry21.webp", "/tanzaniaDry22.webp",
  "/tanzaniaDry23.webp", "/tanzaniaDry24.webp", "/tanzaniaDry25.webp", "/tanzaniaDry26.webp", "/tanzaniaDry27.webp", "/tanzaniaDry28.webp",
  "/tanzaniaDry29.webp", "/tanzaniaDry3.webp", "/tanzaniaDry30.webp", "/tanzaniaDry4.webp", "/tanzaniaDry5.webp", "/tanzaniaDry6.webp",
  "/tanzaniaDry7.webp", "/tanzaniaDry8.webp", "/tanzaniaDry9.webp", "/tanzaniaWet1.webp", "/tanzaniaWet10.webp", "/tanzaniaWet11.webp",
  "/tanzaniaWet12.webp", "/tanzaniaWet13.webp", "/tanzaniaWet14.webp", "/tanzaniaWet15.webp", "/tanzaniaWet16.webp", "/tanzaniaWet17.webp",
  "/tanzaniaWet18.webp", "/tanzaniaWet19.webp", "/tanzaniaWet2.webp", "/tanzaniaWet20.webp", "/tanzaniaWet21.webp", "/tanzaniaWet22.webp",
  "/tanzaniaWet23.webp", "/tanzaniaWet24.webp", "/tanzaniaWet25.webp", "/tanzaniaWet3.webp", "/tanzaniaWet4.webp", "/tanzaniaWet5.webp",
  "/tanzaniaWet6.webp", "/tanzaniaWet7.webp", "/tanzaniaWet8.webp", "/tanzaniaWet9.webp", "/tanzaniaWildlife1.webp", "/tanzaniaWildlife10.webp",
  "/tanzaniaWildlife11.webp", "/tanzaniaWildlife12.webp", "/tanzaniaWildlife13.webp", "/tanzaniaWildlife14.webp", "/tanzaniaWildlife15.webp", "/tanzaniaWildlife16.webp",
  "/tanzaniaWildlife17.webp", "/tanzaniaWildlife18.webp", "/tanzaniaWildlife19.webp", "/tanzaniaWildlife2.webp", "/tanzaniaWildlife20.webp", "/tanzaniaWildlife21.webp",
  "/tanzaniaWildlife22.webp", "/tanzaniaWildlife23.webp", "/tanzaniaWildlife24.webp", "/tanzaniaWildlife25.webp", "/tanzaniaWildlife26.webp", "/tanzaniaWildlife27.webp",
  "/tanzaniaWildlife28.webp", "/tanzaniaWildlife29.webp", "/tanzaniaWildlife3.webp", "/tanzaniaWildlife30.webp", "/tanzaniaWildlife31.webp", "/tanzaniaWildlife32.webp",
  "/tanzaniaWildlife33.webp", "/tanzaniaWildlife34.webp", "/tanzaniaWildlife35.webp", "/tanzaniaWildlife36.webp", "/tanzaniaWildlife37.webp", "/tanzaniaWildlife38.webp",
  "/tanzaniaWildlife39.webp", "/tanzaniaWildlife4.webp", "/tanzaniaWildlife40.webp", "/tanzaniaWildlife41.webp", "/tanzaniaWildlife42.webp", "/tanzaniaWildlife43.webp",
  "/tanzaniaWildlife44.webp", "/tanzaniaWildlife45.webp", "/tanzaniaWildlife46.webp", "/tanzaniaWildlife47.webp", "/tanzaniaWildlife48.webp", "/tanzaniaWildlife49.webp",
  "/tanzaniaWildlife5.webp", "/tanzaniaWildlife50.webp", "/tanzaniaWildlife6.webp", "/tanzaniaWildlife7.webp", "/tanzaniaWildlife8.webp", "/tanzaniaWildlife9.webp",
  "/tarangire1.webp", "/tarangire2.webp", "/tarangire3.webp", "/Tarangire4.webp", "/tarangire5.webp", "/tarangire6.webp",
  "/tarangire7.webp", "/tarangire8.webp", "/teaFarm.webp", "/The-Big-Five-of-the-Sea-1.webp", "/The-Entrance-Walk.webp", "/tilo1.webp",
  "/tilo2.webp", "/tilo3.webp", "/tilo4.webp", "/timbavati.webp", "/timbavati1.webp", "/torotoro.webp",
  "/treeLions.webp", "/trekGorrilla.webp", "/tulia-boutique-hotel1.webp", "/tulia-boutique-hotel10.webp", "/tulia-boutique-hotel11.webp", "/tulia-boutique-hotel12.webp",
  "/tulia-boutique-hotel13.webp", "/tulia-boutique-hotel14.webp", "/tulia-boutique-hotel15.webp", "/tulia-boutique-hotel16.webp", "/tulia-boutique-hotel17.webp", "/tulia-boutique-hotel2.webp",
  "/tulia-boutique-hotel3.webp", "/tulia-boutique-hotel4.webp", "/tulia-boutique-hotel5.webp", "/tulia-boutique-hotel6.webp", "/tulia-boutique-hotel7.webp", "/tulia-boutique-hotel8.webp",
  "/tulia-boutique-hotel9.webp", "/UdzungwaMountains.webp", "/UdzungwaMountains2.webp", "/uganda-community-coffee-tourism-experience.webp", "/Uganda-Food-Tours-and-Safaris-3.webp", "/uganda-map.webp",
  "/uganda.webp", "/ugandaCoffee.webp", "/ugandaDry1.webp", "/ugandaDry10.webp", "/ugandaDry11.webp", "/ugandaDry12.webp",
  "/ugandaDry13.webp", "/ugandaDry14.webp", "/ugandaDry15.webp", "/ugandaDry16.webp", "/ugandaDry17.webp", "/ugandaDry18.webp",
  "/ugandaDry19.webp", "/ugandaDry2.webp", "/ugandaDry20.webp", "/ugandaDry21.webp", "/ugandaDry22.webp", "/ugandaDry23.webp",
  "/ugandaDry24.webp", "/ugandaDry25.webp", "/ugandaDry3.webp", "/ugandaDry4.webp", "/ugandaDry5.webp", "/ugandaDry6.webp",
  "/ugandaDry7.webp", "/ugandaDry8.webp", "/ugandaDry9.webp", "/ugandaWet1.webp", "/ugandaWet10.webp", "/ugandaWet11.webp",
  "/ugandaWet12.webp", "/ugandaWet13.webp", "/ugandaWet14.webp", "/ugandaWet15.webp", "/ugandaWet16.webp", "/ugandaWet17.webp",
  "/ugandaWet18.webp", "/ugandaWet19.webp", "/ugandaWet2.webp", "/ugandaWet20.webp", "/ugandaWet21.webp", "/ugandaWet22.webp",
  "/ugandaWet23.webp", "/ugandaWet24.webp", "/ugandaWet25.webp", "/ugandaWet3.webp", "/ugandaWet4.webp", "/ugandaWet5.webp",
  "/ugandaWet6.webp", "/ugandaWet7.webp", "/ugandaWet8.webp", "/ugandaWet9.webp", "/ugandaWildlife1.webp", "/ugandaWildlife10.webp",
  "/ugandaWildlife11.webp", "/ugandaWildlife12.webp", "/ugandaWildlife13.webp", "/ugandaWildlife14.webp", "/ugandaWildlife15.webp", "/ugandaWildlife16.webp",
  "/ugandaWildlife17.webp", "/ugandaWildlife18.webp", "/ugandaWildlife19.webp", "/ugandaWildlife2.webp", "/ugandaWildlife20.webp", "/ugandaWildlife21.webp",
  "/ugandaWildlife22.webp", "/ugandaWildlife23.webp", "/ugandaWildlife24.webp", "/ugandaWildlife25.webp", "/ugandaWildlife26.webp", "/ugandaWildlife27.webp",
  "/ugandaWildlife28.webp", "/ugandaWildlife29.webp", "/ugandaWildlife3.webp", "/ugandaWildlife30.webp", "/ugandaWildlife31.webp", "/ugandaWildlife32.webp",
  "/ugandaWildlife33.webp", "/ugandaWildlife34.webp", "/ugandaWildlife35.webp", "/ugandaWildlife36.webp", "/ugandaWildlife37.webp", "/ugandaWildlife38.webp",
  "/ugandaWildlife39.webp", "/ugandaWildlife4.webp", "/ugandaWildlife40.webp", "/ugandaWildlife41.webp", "/ugandaWildlife42.webp", "/ugandaWildlife43.webp",
  "/ugandaWildlife44.webp", "/ugandaWildlife45.webp", "/ugandaWildlife46.webp", "/ugandaWildlife47.webp", "/ugandaWildlife48.webp", "/ugandaWildlife49.webp",
  "/ugandaWildlife5.webp", "/ugandaWildlife50.webp", "/ugandaWildlife6.webp", "/ugandaWildlife7.webp", "/ugandaWildlife8.webp", "/ugandaWildlife9.webp",
  "/umoja-campsite1.webp", "/umoja-campsite2.webp", "/umoja-campsite3.webp", "/umoja-campsite4.webp", "/umoja-campsite5.webp", "/va-waterfront.webp",
  "/views.webp", "/village-weaver.webp", "/voi-safari-lodge1.webp", "/voi-safari-lodge10.webp", "/voi-safari-lodge11.webp", "/voi-safari-lodge2.webp",
  "/voi-safari-lodge3.webp", "/voi-safari-lodge4.webp", "/voi-safari-lodge5.webp", "/voi-safari-lodge6.webp", "/voi-safari-lodge7.webp", "/voi-safari-lodge8.webp",
  "/voi-safari-lodge9.webp", "/volcano.webp", "/volcanoeGorilla.webp", "/volunteer.webp", "/voluntering.webp", "/walkingSafari1.webp",
  "/walkingSafari2.webp", "/warangi1.webp", "/warangi10.webp", "/warangi2.webp", "/warangi3.webp", "/warangi4.webp",
  "/warangi5.webp", "/warangi6.webp", "/warangi7.webp", "/warangi8.webp", "/warangi9.webp", "/wasini1.webp",
  "/wasini2.webp", "/waterFall.webp", "/waterFall2.webp", "/whale-sharks-on-mafia.webp", "/whaleWatching.webp", "/white-bellied-go-away-bird.webp",
  "/white-bellied-go-away-bird2.webp", "/White-Water-Rafting.webp", "/white_rhino.webp", "/wild dog.webp", "/wildbeast.webp", "/wildbeast2.webp",
  "/wildbeast3.webp", "/wildbeast4.webp", "/wildbeast5.webp", "/wildbeast6.webp", "/wildbeast7.webp", "/wildbeast8.webp",
  "/wildDogs.webp", "/wildLunch.webp", "/wildLunch2.webp", "/wild_dog.webp", "/wine-pairing.webp", "/winelands-picnic.webp",
  "/workShop.webp", "/yellow-billed-kite.webp", "/zanzibar-sunset-cruise.webp", "/zanzibarBeach.webp", "/zebra1.webp", "/zebra10.webp",
  "/zebra11.webp", "/zebra12.webp", "/zebra13.webp", "/zebra14.webp", "/zebra15.webp", "/zebra16.webp",
  "/zebra17.webp", "/zebra2.webp", "/zebra3.webp", "/zebra4.webp", "/zebra5.webp", "/zebra6.webp",
  "/zebra7.webp", "/zebra8.webp", "/zebra9.webp", "/zipLining.webp", "/zipLining2.webp", "/ziwa.webp",
  "/ziwa2.webp", "/ziwa3.webp", "/ziwa4.webp", "/ziwa5.webp", "/ziwa6.webp", "/ziwaRhino.webp",
];

// Fisher-Yates shuffle
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const STORAGE_KEY = "gallery_order_v4";
const WILDLIFE_LEAD_COUNT = 200;

const WILDLIFE_CATEGORY_PATTERN =
  /^(wildlife|primates|big cats|birdlife|game drive|coastal wildlife|wildlife experience)$/i;
const NON_WILDLIFE_CATEGORY_PATTERN =
  /(accommodation|beach|culture|map|dining|travel|landscape|camp|lodge|resort|adventure|city|family safari|balloon safari|safari dining|safari travel|luxury safari|nature experience|boat safari|coastal travel)/i;
const WILDLIFE_FILENAME_PATTERN =
  /(wildlife|lion|elephant|giraffe|rhino|buffalo|leopard|cheetah|zebra|wildebeest|wildbeast|antelope|hyena|gorilla|chimp|monkey|flamingo|bird|eagle|crane|hippo|crocodile|ostrich|jackal|fox|serengeti|mara|nakuru|manyara|mikumi|ruaha|tarangire|ngorongoro|amboseli|samburu|kruger|ziwa)/i;
const HERO_WILDLIFE_PATTERN =
  /(lion|leopard|cheetah|elephant|rhino|gorilla|chimp|giraffe|zebra|wildebeest|wildbeast|flamingo|buffalo|hippo|crocodile|hyena|colobus|bongo|warthog|waterbuck|kudu|impala|gazelle|ostrich|eagle|kite|crane|parrot)/i;
const QUALITY_CUE_PATTERN =
  /(close|portrait|golden|sunset|herd|pride|migration|crossing|family|calf|cub|action|feeding|walking|resting|running|plains|waterhole|canopy|tusks)/i;
const MIGRATION_WILDLIFE_PATTERN = /(migration|crossing|wildebeest|wildbeast)/i;
const BIG_CAT_PATTERN = /(lion|leopard|cheetah)/i;
const RARE_WILDLIFE_PATTERN = /(gorilla|chimp|rhino)/i;
const CLASSIC_SAFARI_WILDLIFE_PATTERN = /(elephant|giraffe|zebra|buffalo|hippo|crocodile)/i;
const STRONG_PHOTO_CUE_PATTERN =
  /(close-up|close|portrait|sunset|golden|calf|cub|mother|family|herd|crossing|running|yawning|feeding|resting|silhouetted|tusks)/i;
const LOW_QUALITY_FILENAME_PATTERN = /(icon|map|logo|placeholder|collage|copy|crdownload|tiny|background)/i;
const LOW_QUALITY_TEXT_PATTERN = /(icon|logo|placeholder|collage|copy|crdownload|tiny)/i;

const getWildlifePriorityScore = (src: string) => {
  const meta = getGalleryImageSeo(src);
  const category = meta?.category ?? "";
  const text = `${src} ${meta?.title ?? ""} ${meta?.altText ?? ""} ${meta?.caption ?? ""} ${category} ${
    meta?.tags?.join(" ") ?? ""
  }`;
  let score = 0;

  if (WILDLIFE_CATEGORY_PATTERN.test(category)) score += 110;
  if (HERO_WILDLIFE_PATTERN.test(text)) score += 55;
  if (WILDLIFE_FILENAME_PATTERN.test(src)) score += 35;
  if (QUALITY_CUE_PATTERN.test(text)) score += 18;
  if (/^(wildlife|big cats|primates)$/i.test(category)) score += 15;
  if (/^birdlife$/i.test(category)) score += 5;
  if (/^big cats$/i.test(category)) score += 45;
  if (/^primates$/i.test(category)) score += 35;
  if (MIGRATION_WILDLIFE_PATTERN.test(text)) score += 55;
  if (BIG_CAT_PATTERN.test(text)) score += 45;
  if (RARE_WILDLIFE_PATTERN.test(text)) score += 38;
  if (CLASSIC_SAFARI_WILDLIFE_PATTERN.test(text)) score += 20;
  if (STRONG_PHOTO_CUE_PATTERN.test(text)) score += 14;
  if (NON_WILDLIFE_CATEGORY_PATTERN.test(category)) score -= 180;
  if (LOW_QUALITY_FILENAME_PATTERN.test(src) || LOW_QUALITY_TEXT_PATTERN.test(text)) score -= 300;

  return score;
};

const WILDLIFE_FIRST_IMAGES = ALL_IMAGES
  .map((src, index) => ({
    src,
    index,
    score: getWildlifePriorityScore(src),
  }))
  .filter(({ score }) => score >= 95)
  .sort((a, b) => b.score - a.score || a.index - b.index)
  .slice(0, WILDLIFE_LEAD_COUNT)
  .map(({ src }) => src);

function composeGalleryOrder(randomSource: string[]): string[] {
  const wildlifeLeadSet = new Set(WILDLIFE_FIRST_IMAGES);
  const randomizedWildlife = randomSource.filter((src) => wildlifeLeadSet.has(src));
  const missingWildlife = WILDLIFE_FIRST_IMAGES.filter((src) => !randomizedWildlife.includes(src));
  const leadImages = [...randomizedWildlife, ...missingWildlife];
  const leadSet = new Set(leadImages);
  const randomRest = randomSource.filter((src) => ALL_IMAGES.includes(src) && !leadSet.has(src));
  const missingRest = ALL_IMAGES.filter((src) => !leadSet.has(src) && !randomRest.includes(src));

  return [...leadImages, ...randomRest, ...missingRest];
}

function getImages(): string[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed: string[] = JSON.parse(saved);
      return composeGalleryOrder(parsed.filter((s) => ALL_IMAGES.includes(s)));
    }
  } catch {
    // corrupted - fall through
  }
  const orderedImages = composeGalleryOrder(shuffle(ALL_IMAGES));
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(orderedImages)); } catch {}
  return orderedImages;
}

const SITE_URL = "https://karlasafariadventures.com";
const COMPANY_NAME = "Karla Safari Adventures";

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const sanitizeFileName = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "karla-safari-gallery-image";

const loadImageForCanvas = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Unable to load image: ${src}`));
    img.src = src;
  });

const drawFittedText = (
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  fontSize: number,
  fontFamily: string,
  weight = "700",
) => {
  let size = fontSize;
  do {
    ctx.font = `${weight} ${size}px ${fontFamily}`;
    if (ctx.measureText(text).width <= maxWidth || size <= 14) break;
    size -= 2;
  } while (size > 14);
  ctx.fillText(text, x, y);
  return size;
};

const downloadBrandedImage = async (
  src: string,
  meta: GalleryImageSeo | undefined,
) => {
  const title = meta?.title ?? "African Safari Gallery Image";
  const img = await loadImageForCanvas(src);
  const width = img.naturalWidth || img.width;
  const height = img.naturalHeight || img.height;
  const topBar = Math.round(clamp(width * 0.075, 76, 150));
  const bottomBar = Math.round(clamp(width * 0.105, 106, 190));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height + topBar + bottomBar;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Unable to create download canvas");

  ctx.fillStyle = "#272727";
  ctx.fillRect(0, 0, width, topBar);
  ctx.fillStyle = "#f5f1e7";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  drawFittedText(ctx, COMPANY_NAME.toUpperCase(), width / 2, topBar / 2, width * 0.82, clamp(width * 0.034, 24, 54), "Georgia, serif", "600");

  ctx.drawImage(img, 0, topBar, width, height);

  ctx.save();
  ctx.translate(width / 2, topBar + height / 2);
  ctx.rotate(-Math.PI / 12);
  ctx.globalAlpha = 0.18;
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  drawFittedText(ctx, COMPANY_NAME.toUpperCase(), 0, 0, width * 0.78, clamp(width * 0.06, 42, 120), "Arial, sans-serif", "800");
  ctx.restore();

  ctx.fillStyle = "#272727";
  ctx.fillRect(0, topBar + height, width, bottomBar);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#ffffff";
  const titleSize = drawFittedText(
    ctx,
    title,
    width / 2,
    topBar + height + bottomBar * 0.42,
    width * 0.88,
    clamp(width * 0.03, 22, 48),
    "Arial, sans-serif",
    "800",
  );
  ctx.fillStyle = "rgba(255,255,255,0.56)";
  drawFittedText(
    ctx,
    `Downloaded from ${COMPANY_NAME}. All rights reserved.`,
    width / 2,
    topBar + height + bottomBar * 0.72,
    width * 0.9,
    Math.max(12, Math.round(titleSize * 0.48)),
    "Arial, sans-serif",
    "400",
  );

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((result) => (result ? resolve(result) : reject(new Error("Unable to export branded image"))), "image/jpeg", 0.92);
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${sanitizeFileName(title)}-karla-safari-adventures.jpg`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
};

const getAbsoluteImageUrl = (src: string) => {
  if (/^https?:\/\//i.test(src)) return src;
  if (typeof window === "undefined") return `${SITE_URL}${src}`;
  return new URL(src, window.location.origin).href;
};

const createShareableGalleryImageFile = async (
  src: string,
  meta: GalleryImageSeo | undefined,
) => {
  const title = meta?.title ?? "African Safari Gallery Image";
  const img = await loadImageForCanvas(src);
  const width = img.naturalWidth || img.width;
  const height = img.naturalHeight || img.height;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Unable to create share canvas");
  ctx.drawImage(img, 0, 0, width, height);

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((result) => (result ? resolve(result) : reject(new Error("Unable to export share image"))), "image/jpeg", 0.92);
  });

  return new File([blob], `${sanitizeFileName(title)}-karla-safari-adventures.jpg`, { type: "image/jpeg" });
};

const copyShareText = async (text: string) => {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  textarea.remove();
};

const shareGalleryImage = async (
  src: string,
  meta: GalleryImageSeo | undefined,
) => {
  const title = meta?.title ?? "African Safari Gallery Image";
  const imageUrl = getAbsoluteImageUrl(src);
  const shareText = `${meta?.caption ?? "Safari gallery image from Karla Safari Adventures."}\n${imageUrl}`;

  if (navigator.share) {
    try {
      const file = await createShareableGalleryImageFile(src, meta);
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ title, text: shareText, files: [file] });
        return "Image ready to share.";
      }
    } catch (error) {
      console.warn("Image file sharing is unavailable; falling back to link share.", error);
    }

    try {
      await navigator.share({ title, text: shareText, url: imageUrl });
      return "Image link ready to share.";
    } catch (error) {
      if ((error as Error).name === "AbortError") return "";
    }
  }

  await copyShareText(`${title}\n${shareText}`);
  return "Image link copied.";
};

const galleryStructuredData = {
  "@context": "https://schema.org",
  "@type": "ImageGallery",
  name: "Karla Safari Adventures Photo Gallery",
  description: "Safari wildlife, accommodation, culture, adventure, and destination images from Karla Safari Adventures.",
  associatedMedia: Object.entries(GALLERY_IMAGE_SEO).map(([src, meta]) => ({
    "@type": "ImageObject",
    contentUrl: `${SITE_URL}${src}`,
    name: meta.title,
    caption: meta.caption,
    description: meta.description,
    keywords: meta.tags.join(", "),
    about: meta.category,
    ...(meta.location ? { contentLocation: meta.location } : {}),
  })),
};

const Gallery = () => {
  const [images] = useState<string[]>(getImages);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [visibleCount, setVisibleCount] = useState(60);
  const [columnCount, setColumnCount] = useState(5);
  const [isDownloading, setIsDownloading] = useState(false);
  const [sharingSrc, setSharingSrc] = useState<string | null>(null);
  const [shareStatus, setShareStatus] = useState("");
  const loaderRef = useRef<HTMLDivElement>(null);

  // Pre-fetch the first 120 images immediately
  useEffect(() => {
    images.slice(0, 120).forEach(preloadImage);
  }, [images]);

  useEffect(() => {
    const update = () => {
      if (window.innerWidth >= 1680) setColumnCount(5);
      else if (window.innerWidth >= 768) setColumnCount(4);
      else setColumnCount(2);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Infinite scroll — fires 2500px before the bottom
  useEffect(() => {
    if (!loaderRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((prev) => {
            const next = Math.min(prev + 60, images.length);
            images.slice(prev, next + 60).forEach(preloadImage);
            return next;
          });
        }
      },
      { rootMargin: "2500px" }
    );
    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [images.length, images]);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxIndex(null);
      if (e.key === "ArrowRight")
        setLightboxIndex((i) => (i !== null ? Math.min(i + 1, images.length - 1) : null));
      if (e.key === "ArrowLeft")
        setLightboxIndex((i) => (i !== null ? Math.max(i - 1, 0) : null));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxIndex, images.length]);

  const visible = images.slice(0, visibleCount);
  const cols = Array.from({ length: columnCount }, (_, c) =>
    visible
      .map((src, i) => ({ src, index: i }))
      .filter((_, i) => i % columnCount === c)
  );
  const activeSrc = lightboxIndex !== null ? images[lightboxIndex] : null;
  const activeMeta = activeSrc ? getGalleryImageSeo(activeSrc) : undefined;

  const handleDownload = async () => {
    if (lightboxIndex === null || !activeSrc) return;
    setIsDownloading(true);
    try {
      await downloadBrandedImage(activeSrc, activeMeta);
    } catch (error) {
      console.error("Unable to download gallery image", error);
      window.alert("Sorry, the image download could not be prepared. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShare = async (src: string, meta: GalleryImageSeo | undefined) => {
    setSharingSrc(src);
    setShareStatus("Preparing image share...");
    try {
      const status = await shareGalleryImage(src, meta);
      setShareStatus(status);
      if (status) window.setTimeout(() => setShareStatus(""), 2600);
    } catch (error) {
      console.error("Unable to share gallery image", error);
      setShareStatus("Image share unavailable. Link copy failed.");
      window.setTimeout(() => setShareStatus(""), 3200);
    } finally {
      setSharingSrc(null);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <style>{SHIMMER_STYLE}</style>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(galleryStructuredData) }}
      />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src="/safariHero.jfif" alt="African savanna sunset" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-6 py-32 md:py-44 text-center">
          <motion.span
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="inline-block text-primary font-semibold tracking-widest uppercase text-sm mb-4"
          >
            Photo Gallery
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold mb-2"
          >
            Africa Through <span className="text-primary italic">Our Lens</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
            className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mt-6 leading-relaxed"
          >
            Every frame tells a story of untamed beauty. These images were captured during safaris across{" "}
            <span className="text-foreground font-medium">Kenya</span>,{" "}
            <span className="text-foreground font-medium">Tanzania</span>,{" "}
            <span className="text-foreground font-medium">Uganda</span>, and{" "}
            <span className="text-foreground font-medium">Rwanda</span> — a glimpse of what awaits you with Karla Safari Adventures.
          </motion.p>
          <motion.div
            className="max-w-3xl mx-auto px-4 mt-5"
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }} viewport={{ once: true }}
          >
            <div className="relative bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl p-6 md:p-8 shadow-2xl overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-200/0 via-transparent to-orange-300/20 group-hover:from-orange-200/20 transition-all duration-500" />
              <div className="absolute -top-4 -left-4 w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center shadow-lg">
                <StickyNote className="w-5 h-5 text-white" />
              </div>
              <div className="absolute top-4 right-4 opacity-5">
                <Camera className="w-24 h-24 md:w-32 md:h-32 text-orange-600" />
              </div>
              <p className="text-slate-800 text-base md:text-lg leading-relaxed font-medium relative z-10">
                <span className="text-orange-600 font-bold text-2xl md:text-3xl">"</span>
                Below is a preview of how your photo gallery will look after experiencing a safari expertly organized by our team
                <span className="text-orange-600 font-bold text-2xl md:text-3xl">"</span>
              </p>
              <div className="absolute -bottom-3 -right-3 w-8 h-8 bg-orange-400 rounded-full opacity-60" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Masonry Grid ── */}
      <div className="px-2 md:px-4 pb-8">
        <div className="flex gap-2 md:gap-3">
          {cols.map((col, c) => (
            <div key={c} className="flex-1 flex flex-col gap-2 md:gap-3">
              {col.map(({ src, index }) => (
                <ImageCard
                  key={src}
                  src={src}
                  index={index}
                  meta={getGalleryImageSeo(src)}
                  heightClass={HEIGHTS[(index + c) % HEIGHTS.length]}
                  onClick={() => setLightboxIndex(index)}
                />
              ))}
            </div>
          ))}
        </div>
        <div ref={loaderRef} className="h-10" />
      </div>

      {/* ── CTA ── */}
      <section className="relative py-20 md:py-28 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#3d1a00] via-[#5c2800] to-[#2a1500]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_50%,rgba(251,146,60,0.18),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_20%,rgba(234,88,12,0.15),transparent_55%)]" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-400/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-400/40 to-transparent" />
        <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-orange-600/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full bg-amber-700/10 blur-3xl pointer-events-none" />
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="relative z-10 max-w-3xl mx-auto text-center"
        >
          <div className="inline-flex items-center gap-2 mb-8 rounded-full border border-orange-400/30 bg-orange-400/10 px-5 py-2">
            <Camera className="w-4 h-4 text-orange-300" />
            <span className="text-orange-300 text-xs font-bold tracking-widest uppercase">True Safari Enthusiast</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white leading-tight">
            You've Seen the Wild —{" "}
            <span className="text-orange-400 italic">Now Live It</span>
          </h2>
          <p className="text-orange-100/70 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
            You've scrolled through every photo — that's the spirit of a real adventurer. Let us craft your dream safari and bring these moments to life, just for you.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
            <a
              href="/tours"
              className="inline-flex items-center gap-2 rounded-full bg-orange-500 hover:bg-orange-400 px-8 py-3.5 text-white font-semibold transition-all hover:scale-105 shadow-lg shadow-orange-900/40 active:scale-95"
            >
              <Compass className="w-5 h-5" /> Explore Safari Packages
            </a>
            <a
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-white hover:bg-orange-50 px-8 py-3.5 text-slate-600 font-semibold transition-all hover:scale-105 shadow-lg shadow-black/20 active:scale-95"
            >
              <MessageCircle className="w-5 h-5" /> Plan a Custom Safari
            </a>
          </div>
          <p className="mt-5 text-orange-200/40 text-xs tracking-wide">
            No commitment · Free consultation · Tailor-made itineraries
          </p>
        </motion.div>
      </section>

      {/* ── Lightbox ── */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-[99999] flex items-center justify-center bg-white/25 p-3 backdrop-blur-xl md:p-6"
          onClick={() => setLightboxIndex(null)}
        >
          <figure
            className="relative flex max-h-[94vh] w-full max-w-6xl flex-col overflow-hidden rounded-lg bg-neutral-950/95 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden bg-neutral-950">
              <img
                src={images[lightboxIndex]}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 h-full w-full scale-110 object-cover opacity-45 blur-2xl"
              />
              <div className="absolute inset-0 bg-white/5" />
              <img
                key={images[lightboxIndex]}
                src={images[lightboxIndex]}
                alt={activeMeta?.altText ?? "African safari travel gallery image"}
                title={activeMeta?.title}
                className="relative z-10 max-h-[64vh] w-full object-contain md:max-h-[72vh]"
              />
              <button
                type="button"
                className="absolute left-3 top-3 z-30 inline-flex items-center gap-1.5 rounded-full bg-orange-500 px-3 py-2 text-xs font-bold text-white shadow-lg shadow-black/30 transition hover:bg-orange-400 disabled:cursor-wait disabled:opacity-70 md:left-4 md:top-4 md:px-4"
                onClick={(e) => {
                  e.stopPropagation();
                  void handleDownload();
                }}
                disabled={isDownloading}
                aria-label={`Download ${activeMeta?.title ?? "gallery image"} with Karla Safari Adventures watermark`}
                title="Download watermarked image"
              >
                <Download className="h-4 w-4" />
                <span>{isDownloading ? "Preparing" : "Download"}</span>
              </button>
              <button
                type="button"
                className="absolute right-3 top-3 z-30 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-2 text-xs font-bold text-slate-900 shadow-lg shadow-black/25 transition hover:bg-orange-50 disabled:cursor-wait disabled:opacity-70 md:right-4 md:top-4 md:px-4"
                onClick={(e) => {
                  e.stopPropagation();
                  if (activeSrc) void handleShare(activeSrc, activeMeta);
                }}
                disabled={!activeSrc || sharingSrc === activeSrc}
                aria-label={`Share ${activeMeta?.title ?? "gallery image"} to social media`}
                title="Share image to social media"
              >
                <Share2 className="h-4 w-4" />
                <span>{sharingSrc === activeSrc ? "Preparing" : "Share"}</span>
              </button>
            </div>
            <figcaption className="border-t border-white/10 bg-neutral-950/95 px-4 py-4 text-center md:px-8">
              <h2 className="text-lg font-bold text-white md:text-2xl">
                {activeMeta?.title ?? "African Safari Gallery Image"}
              </h2>
              <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs text-white/45">
                {activeMeta?.location && <span>{activeMeta.location}</span>}
                {activeMeta?.location && activeMeta?.category && <span aria-hidden="true">|</span>}
                {activeMeta?.category && <span>{activeMeta.category}</span>}
                <span aria-hidden="true">|</span>
                <span>{lightboxIndex + 1} / {images.length}</span>
              </div>
            </figcaption>
          </figure>
          <button
            className="absolute top-4 right-4 p-2 rounded-full bg-secondary text-secondary-foreground hover:bg-muted transition"
            onClick={() => setLightboxIndex(null)}
            aria-label="Close gallery image"
          >
            <X className="w-6 h-6" />
          </button>
          {lightboxIndex > 0 && (
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-secondary text-secondary-foreground hover:bg-muted transition"
              onClick={(e) => { e.stopPropagation(); setLightboxIndex(lightboxIndex - 1); }}
              aria-label="Previous gallery image"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}
          {lightboxIndex < images.length - 1 && (
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-secondary text-secondary-foreground hover:bg-muted transition"
              onClick={(e) => { e.stopPropagation(); setLightboxIndex(lightboxIndex + 1); }}
              aria-label="Next gallery image"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}
        </div>
      )}
      {shareStatus && (
        <div className="fixed bottom-5 left-1/2 z-[100000] -translate-x-1/2 rounded-full bg-neutral-950 px-5 py-3 text-sm font-semibold text-white shadow-2xl">
          {shareStatus}
        </div>
      )}
    </div>
  );
};

const ImageCard = ({
  src, index, meta, heightClass, onClick,
}: {
  src: string; index: number; meta?: GalleryImageSeo; heightClass: string; onClick: () => void;
}) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const fallbackAlt = `African safari travel gallery image ${index + 1}`;

  if (error) return null;

  return (
    <figure
      className={`group relative ${heightClass} overflow-hidden rounded-lg cursor-pointer focus-within:ring-2 focus-within:ring-primary`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
    >
      {/* Shimmer placeholder */}
      <div
        className={`absolute inset-0 transition-opacity duration-500 ${
          loaded ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
        style={{
          background:
            "linear-gradient(90deg, hsl(30 40% 18%) 25%, hsl(30 50% 26%) 50%, hsl(30 40% 18%) 75%)",
          backgroundSize: "200% 100%",
          animation: "shimmer 1.5s infinite",
        }}
      />
      <img
        src={src}
        alt={meta?.altText ?? fallbackAlt}
        title={meta?.title}
        onLoad={() => { loadedCache.add(src); setLoaded(true); }}
        onError={() => setError(true)}
        className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-110 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
      />
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/65 to-transparent px-3 pb-3 pt-10 opacity-0 transition-opacity group-hover:opacity-100 group-focus:opacity-100">
        {meta ? (
          <figcaption>
            <h3 className="line-clamp-1 text-sm font-bold text-white">{meta.title}</h3>
          </figcaption>
        ) : (
          <figcaption className="text-xs text-white/70">Karla Safari Adventures gallery image</figcaption>
        )}
      </div>
    </figure>
  );
};

export default Gallery;
