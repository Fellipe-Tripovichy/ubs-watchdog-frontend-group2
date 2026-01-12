/**
 * FlagImage Component
 * Generates FlagCDN URLs for country flags
 * 
 * @see https://flagcdn.com/
 */

// Common country name to ISO 3166-1 alpha-2 code mapping
// Supports both English and Brazilian Portuguese names
const COUNTRY_CODE_MAP: Record<string, string> = {
  // English
  "united states": "us",
  "united states of america": "us",
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
  // Brazilian Portuguese
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

/**
 * Converts a country name to ISO 3166-1 alpha-2 code
 * Supports both English and Brazilian Portuguese country names
 * @param countryName - The name of the country (in English or Brazilian Portuguese)
 * @returns The ISO country code in lowercase, or the original input if no mapping found
 */
function countryNameToCode(countryName: string): string {
  const normalizedName = countryName.toLowerCase().trim();
  return COUNTRY_CODE_MAP[normalizedName] || normalizedName;
}

/**
 * Generates a FlagCDN URL for a country flag
 * @param country - Country name (English or Brazilian Portuguese) or ISO 3166-1 alpha-2 code
 * @param size - Flag size (e.g., "w40", "w320", or empty string for default SVG)
 * @param format - Image format (png, svg, jpg, webp)
 * @returns The FlagCDN URL string
 */
export function getFlagUrl(
  country: string,
  size: FlagSize = "",
  format: FlagFormat = "svg"
): string {
  const countryCode = countryNameToCode(country);
  
  // Format size: if it's a number, prepend 'w', otherwise use as-is
  let sizePrefix = "";
  if (size) {
    if (typeof size === "number") {
      sizePrefix = `w${size}/`;
    } else {
      sizePrefix = `${size}/`;
    }
  }
  
  // Format extension (ensure lowercase)
  const formatLower = format.toLowerCase() as FlagFormat;
  
  // Build URL: https://flagcdn.com/[size]/[country_code].[format]
  return `https://flagcdn.com/${sizePrefix}${countryCode}.${formatLower}`;
}

/**
 * FlagImage Component Props
 */
export interface FlagImageProps {
  /** Country name (English or Brazilian Portuguese) or ISO 3166-1 alpha-2 code */
  country: string;
  /** Flag size (e.g., "w40", "w320", or empty for default) */
  size?: FlagSize;
  /** Image format */
  format?: FlagFormat;
  /** Additional CSS classes */
  className?: string;
  /** Alt text for the image */
  alt?: string;
  /** Additional image props */
  [key: string]: any;
}

/**
 * FlagImage Component
 * Renders a country flag image using FlagCDN
 */
export function FlagImage({
  country,
  size = "",
  format = "svg",
  className,
  alt,
  ...props
}: FlagImageProps) {
  const flagUrl = getFlagUrl(country, size, format);
  const altText = alt || `Flag of ${country}`;

  return (
    <img
      src={flagUrl}
      alt={altText}
      className={className}
      {...props}
    />
  );
}
