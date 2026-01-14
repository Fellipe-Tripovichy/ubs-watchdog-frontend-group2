"use client";

import { useState } from "react";
import { Flag } from "lucide-react";

const COUNTRY_CODE_MAP: Record<string, string> = {
  "united states": "us",
  "united states of america": "us",
  "european union": "eu",
  "eurozone": "eu",
  "euro": "eu",
  "euro area": "eu",
  "usa": "us",
  "brazil": "br",
  "united kingdom": "gb",
  "great britain": "gb",
  "uk": "gb",
  "japan": "jp",
  "germany": "de",
  "france": "fr",
  "italy": "it",
  "spain": "es",
  "china": "cn",
  "india": "in",
  "russia": "ru",
  "canada": "ca",
  "australia": "au",
  "mexico": "mx",
  "south korea": "kr",
  "korea": "kr",
  "netherlands": "nl",
  "belgium": "be",
  "switzerland": "ch",
  "sweden": "se",
  "norway": "no",
  "denmark": "dk",
  "finland": "fi",
  "poland": "pl",
  "portugal": "pt",
  "greece": "gr",
  "turkey": "tr",
  "argentina": "ar",
  "chile": "cl",
  "colombia": "co",
  "peru": "pe",
  "venezuela": "ve",
  "south africa": "za",
  "egypt": "eg",
  "nigeria": "ng",
  "kenya": "ke",
  "saudi arabia": "sa",
  "uae": "ae",
  "united arab emirates": "ae",
  "israel": "il",
  "thailand": "th",
  "singapore": "sg",
  "malaysia": "my",
  "indonesia": "id",
  "philippines": "ph",
  "vietnam": "vn",
  "new zealand": "nz",
  "ireland": "ie",
  "austria": "at",
  "czech republic": "cz",
  "hungary": "hu",
  "romania": "ro",
  "ukraine": "ua",
  "união europeia": "eu",
  "zona do euro": "eu",
  "brasil": "br",
  "estados unidos": "us",
  "estados unidos da américa": "us",
  "eua": "us",
  "reino unido": "gb",
  "grã-bretanha": "gb",
  "japão": "jp",
  "alemanha": "de",
  "frança": "fr",
  "itália": "it",
  "espanha": "es",
  "índia": "in",
  "rússia": "ru",
  "canadá": "ca",
  "austrália": "au",
  "méxico": "mx",
  "coreia do sul": "kr",
  "coreia": "kr",
  "holanda": "nl",
  "países baixos": "nl",
  "bélgica": "be",
  "suíça": "ch",
  "suécia": "se",
  "noruega": "no",
  "dinamarca": "dk",
  "finlândia": "fi",
  "polônia": "pl",
  "grécia": "gr",
  "turquia": "tr",
  "colômbia": "co",
  "áfrica do sul": "za",
  "egito": "eg",
  "nigéria": "ng",
  "quênia": "ke",
  "arábia saudita": "sa",
  "emirados árabes unidos": "ae",
  "eau": "ae",
  "tailândia": "th",
  "singapura": "sg",
  "malásia": "my",
  "indonésia": "id",
  "filipinas": "ph",
  "vietnã": "vn",
  "nova zelândia": "nz",
  "irlanda": "ie",
  "áustria": "at",
  "república tcheca": "cz",
  "tchéquia": "cz",
  "hungria": "hu",
  "romênia": "ro",
  "ucrânia": "ua",
};

export type FlagFormat = "png" | "svg" | "jpg" | "webp";
export type FlagSize = string | number | "w20" | "w40" | "w80" | "w160" | "w320" | "w640";

function getFlagSize(size: FlagSize): number {
  if (size === "w20") return 20;
  if (size === "w40") return 40;
  if (size === "w80") return 80;
  if (size === "w160") return 160;
  if (size === "w320") return 320;
  if (size === "w640") return 640;
  return 40;
} 
function countryNameToCode(countryName: string): string {
  const normalizedName = countryName.toLowerCase().trim();
  return COUNTRY_CODE_MAP[normalizedName] || normalizedName;
}

export function getFlagUrl(
  country: string,
  size: FlagSize = "",
  format: FlagFormat = "svg"
): string {
  const countryCode = countryNameToCode(country);
  
  let sizePrefix = "";
  if (size) {
    if (typeof size === "number") {
      sizePrefix = `w${size}/`;
    } else {
      sizePrefix = `${size}/`;
    }
  }
  
  const formatLower = format.toLowerCase() as FlagFormat;
  
  return `https://flagcdn.com/${sizePrefix}/${countryCode}.${formatLower}`;
}

export interface FlagImageProps {
  country: string;
  size?: FlagSize;
  format?: FlagFormat;
  className?: string;
  alt?: string;
  [key: string]: any;
}

export function FlagImage({
  country,
  size = "w20",
  format = "png",
  className,
  alt,
  ...props
}: FlagImageProps) {
  const [hasError, setHasError] = useState(false);
  const flagUrl = getFlagUrl(country, size, format);
  const altText = alt || `Flag of ${country}`;

  if (hasError) {
    return (
      <Flag
        className={`size-${getFlagSize(size)/4}`}
        aria-label={altText}
        {...props}
      />
    );
  }

  return (
    <img
      src={flagUrl}
      alt={altText}
      onError={() => setHasError(true)}
      width={getFlagSize(size)}
      height="auto"
      {...props}
    />
  );
}
