// platformsData.js
import { Globe, Tv, Radio, MapPin, Users } from 'lucide-react';

export const allPlatforms = {
    websites: [
        { 
            id: 'newtimes', 
            name: 'The New Times', 
            icon: Globe, 
            iconUrl: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAARMAAAC3CAMAAAAGjUrGAAAAjVBMVEX///8AAAAVFhb8/Pz5+fnv7+/n5+evr68QERHV1dW4uLgvMDCXl5dNTk7Dw8P29vaio6MKCwthYWHT09PJyckZGRkmJyfb29upqal2d3fr6+tYWlo5Ojq0tLSenp7Nzc1ubm5/f39AQUGMjIxHSEh1dXUeHx+JiYk7PDyUlJRUVVVdXV0tLS0jJCRlZmapFyJLAAAIzUlEQVR4nO2aC3uiOhPHZwTCReUiaJAqiFgt6vr9P947SRC13d1TrXt6znnn9+w+JSHk8mdmMqEFYBiGYRiGYRiGYRiGYRiGYRiGYRiGYRiGYRiGYRiGYRiGYRiGYRiGYRiGYRiGYRiGYRiGYRiGYRiGYR7E/u4JWN89gVvy1Xj69r1TaDxcy28bPfyAFNUOx597MOuLRaDKgbhvdPlx+JC0CNEb4PrepTwLG/FlokBcn+jH6YgNQPAZTVZIlOeiU66pi1Fx3/A7/EgNEONg4E2/y30iXJiLIS71zxDbz2kCUNLMMbyUk+ndw5MmpRDCp54GWNFVrDXxERM83d3bk3CUBIQ1RFdfRLj7rCYj9Tbx4vbJ9O7IXOM00rNQmigbswdKEwhPL010b2fPQqCJAL0mMF/do8kgmTnn8gOarIzzGU30TEpc3dvJs6m6GVw0EeO7NBlcml5pYkWfk2e80EHjShPrbWNu2ZfO7Nuybd9EGsu23xW/GIjszkIvmkDRaeLkq8n8KlwEry+TnX/17AgTT61l3pV7TdwXCpWLnQNyfFDx+zDWy20Ok4Px1HBMdSp+bYznXWkCktIAJ2sPid53omo08TYQtW+Iw5b6j8oN4nbV72/hKUE81rIvbmnsTZ0/YSe/0gSMJi1uTnvEQ7dOf7YJC9ni6+UljLCeaVHKG00ETb+klkjxV+wxSXCoJ5ipwIlRN8CbVrfr7FoTUkUtK0nUaznqneglUxUUu9YQUhdIV2hejkPq1zKnulgV7QPtfUEanPAZEfq9JptJo0KeWOuQp3aCU3fn9UqTPDXuE15pIqaotnN4RY8mrhp4ng45zpQExEA3DTG/Hv1WE0sEVFaaWKJSom+xduNFovwUJ3l+UHeNFS3M4kc0VmDGTPRYQ1w9X5NtZ3sSUQ1iD7adk52wumgSQ65W020+RpM1mh0kw0FCoWGdnIWwlFF10s7xJrm71cSUExOnBh5lKnpv2qrHU1V3UH0qQ1nRWGo6gkxna9NkO63oavN8TfrA+aaNoO2TsxBX51tKE8ow1OYzjM6akEhmNRHqiav0CyeqIkPtaEpia3sbw/9Ck5m+OmG3X4Orrmi6FUnh6XskN+VXS+wzPVF//cT2S032Opeb9WlIgcNzRNGawEGvZ3/WZJN0Qdei90pKOjqJUULUycIzayGPunGdz2kyx846QLmWGvu1twuyRnJqrdXJgSfxS01eVL3EPkW1MTkPajSxlaPrTEtpolbTpYFHT6uzws55BvvwvNQGb88Aj2hChqtUN764T1T7SneDk/A5p4LfaxLiWyGElL6fhtivx2gCwuzIsdZETQvrcJmPmmniqRnrGv3TBR1RaOlv+9vRH9NEqFaTbJmX7ZDGeqPcJtEhH6ftM1T5vSYuHleHl5f9eLMZ78e3dqKjqT6ubEkTNV1vuF4sFkP690NtUnrDiCiNdygsafHEO9d5UBOpxpqdx5qN9TlJTYWcdXHnYfQRTfY/eeasSbf5bKekSYiXfKWjNM7z46SCkd5FY3z3SeFxTXB105E4qURGdfYn953Od372MaPXhGxAieKRJima2HKFDjErqWOK2TvG708OX/Cd912JeK1VwQy+yl/F2MFPHPSiidl8vC7GJu+MioTwZiudwZpw8951vhBjvcHVGjqnlpvkg7E+wu81saf4k/PDlSaRChpKE5Oj3TpzqLdjYzwqCuJ713lUE72l9SkkvbnudFZ8dOBH+L0mlAns+pviNj/pKtEzmugcrelqM6Pk0ettOf6ZvT+qSYh9YkyKZFG/JaoU7k/7Di0ZzyfisD9dXWuiNh+tiTVUlqCdw9mh0zWkCGyaRZ43+OA6j2qiXda8gKikW1tc6ZZ24iXDJ+zG52+PYAbtNTmY+hg9bZhRM+yT5tHN4nLUmoAcqImu5zUdWVNzi4Jhb2c1vnctMOeA6+rol5powwu7PBachboavtYTldoDnZm1dbR0AP+ymYiwpPQvSKOudMKpq0eX7g9KC9ULdBGHq/kL7s/Zid8ecdiml05qRPOt4NB9bL78NmJyMTM6VH7YKsq9br8vzQOR/v6COM8sdepXVxKc0UBdjUOw8zd1dWyodfTajTVTGsR0TCaBNnSzgi9iuXHsunkcmzkt41wVSCA71pdLM9PVeF9fxnL1rSuHA9ft7FWWp/1hd/Wmss2pN+XV5sogNSH1pMhjEyOLsivnTneHbghzmefQVXatRbzav8yDrnvh1ofxYRcCwzAMw5wpLFn80/6W4nuxU1GFof/JX4r9X2D51TIPlkEQsaWcEeEy3jVtHqqPpnaWpZD6IB1IrSICq4rAj2SWUbLsFFQdZZkNVkaJtJ9VlAoL1aaqbKikU0HkQ5SFhbqpn6D/qR9lBaQpFN/3Jz33YmdhXC9l0yzV397AQo7K4AD7EcRwUl/iJ+Ba8c4eSyhXsEsPRUhKbOj/qKUmsKe8eZKJNcyDCANwo7Ejqaoto42ApgZoYtgW4G/BfcLHx78Jp1qWdKIVZCjqBLSRpWvNinYjU8dd0/FgNQogbyGvIR/Se6/X6uvcnuSL61SAzDcApwom4S6M8pkMcvNVZhQrzZbHCNochmQuzfzrnwr+PoTb0hHZr+NQBdlxTmfe+Ws03kEeLjLIYX3SmrTZchKDFUklitKkbEmiMjz6WpOKNAn9rUuaNIHRpAwDsiKjieXMvnuddxDJKm6aoB65UvuOqFvIXiBv7BKCMZRQDKHcORNRgpza0Sma08l7U8mgbOyRyCE/wCGUJ3gNnCXkO3KZOR0pm1FxKEqojtCUsFXxaPtviuAyXcajtnRV8ATbL6zUsgREjiPASSNpgwPST8lAIEodEBWFV4sqHOn7shBQUBufvE4KakFt7Ypa0RO+eSKS0vb9NHL8b/srp0eoZOgGwdJ/2q8w/wtIQcYt/lXv8c8TQcGKMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDMAzDfJX/ASjMkrrGhtV9AAAAAElFTkSuQmCC",
            rateCards: [
                {
                    title: "Digital Featured / Sponsored Article",
                    type: "",
                    description: "Staff from The New Times staff produce a customized article about what you want to feature. Maximum of 400 words and 1 Pictures,  A Permanent link to the client’s page, Article promoted on The New Times Home page.",
                    quantity: "",
                    price: "RWF 400,000",
                    imageUrl: "path/to/newtimes-breaking-banner.png"
                },
                {
                    title: "Digital Featured / Sponsored Article(Premium)",
                    type: "",
                    description: "A customized article about what you want to feature. Maximum of 600 words and a photo gallery (5 plus pictures), A Permanent link to the client’s page, Article promoted on The New Times Home page, The article will feature on The New Times digital Newsletter, The Article will be promoted on Twitter (Over 430,700+ followers), The Article will be promoted on The New Times Facebook page",
                    quantity: "",
                    price: "RWF 600,000",
                    imageUrl: "path/to/newtimes-breaking-banner.png"
                },
                {
                    title: "Above & Next to News Content",
                    type: "728x90, 300x250, 300x600",
                    description: "High-visibility placement beside active news content for repeated brand exposure.",
                    quantity: "30 days",
                    price: "RWF 800,000 Per Week",
                    imageUrl: "path/to/newtimes-breaking-banner.png"
                },
                {
                    title: "Above Business, Africa & International News",
                    type: "970x250",
                    description: "Premium placement reaching professionals and decision-makers reading serious news.",
                    quantity: "14 days",
                    price: "RWF 650,000 Per Week",
                    imageUrl: "path/to/newtimes-breaking-banner.png"
                }
            ]
        },
        
        { 
            id: 'ktpress', 
            name: 'KT Press', 
            icon: Globe, 
            iconUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQhZuCWbaNV_EQ9yYuBHrAx8wxVduxQTMacLA&s",
            rateCards: [
                {
                    title: "Top Large leaderboard (Ultimate Plan)",
                    type: "1260*90 pixels",
                    description: "The big top most banner on the web page",
                    quantity: "30 days",
                    price: "RWF 500,000 Per Week",
                    imageUrl: "path/to/newtimes-breaking-banner.png"
                },
                {
                    title: "Top leaderboard (Ultimate Plan)",
                    type: "940*90 pixels",
                    description: "The second top banner on the webpage slightly smaller than the top most banner",
                    quantity: "30 days",
                    price: "RWF 450,000 Per Week",
                    imageUrl: "path/to/newtimes-breaking-banner.png"
                },
            ]
        },
        { 
            id: 'kigalitoday', 
            name: 'Kigali Today', 
            icon: Globe, 
            iconUrl: "https://www.kigalitoday.com/elections_2024/img/kigalitoday_logo-election_2024_1.png",
            rateCards: [
                {
                    title: "Top Large leaderboard (Ultimate Plan)",
                    type: "1260*90 pixels",
                    description: "The big top most banner on the web page",
                    quantity: "30 days",
                    price: "RWF 500,000 Per Week",
                    imageUrl: "path/to/newtimes-breaking-banner.png"
                },
                {
                    title: "Top leaderboard (Ultimate Plan)",
                    type: "940*90 pixels",
                    description: "The second top banner on the webpage slightly smaller than the top most banner",
                    quantity: "30 days",
                    price: "RWF 450,000 Per Week",
                    imageUrl: "path/to/newtimes-breaking-banner.png"
                },
            ]
        }
    ],
    tv: [
        { 
            id: 'rtv', 
            name: 'RTV', 
            icon: Tv, 
            iconUrl: "https://rba.co.rw/admin/user_data/profile/bc6ba.jpg",
            rateCards: [
                {
                    title: "Advert before or after News",
                    item: "",
                    time: "",
                    price: "RWF 6,195 per Second",
                    imageUrl: "path/to/rtv-primetime.png",
                    additionalInfo: "Minimum booking: 5 spots per week"
                },
                {
                    title: "Advert within News",
                    item: "",
                    time: "",
                    price: "RWF 11,800 per Second",
                    imageUrl: "path/to/rtv-primetime.png",
                    additionalInfo: "Minimum booking: 5 spots per week"
                },
                {
                    title: "Sponsored Article",
                    item: "1 story",
                    time: "",
                    price: "RWF 590,000",
                    imageUrl: "path/to/rtv-primetime.png",
                    additionalInfo: "Minimum booking: 5 spots per week"
                },
            ]
        },
        { 
            id: 'tv1', 
            name: 'TV1', 
            icon: Tv, 
            iconUrl: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBw8QEBAODw8PEA4PEA8PEA0QEBAODg8PFhEXFhURFRUYHSggGBolGxUVITIhJSkrLi4uFx8zODMtNygtLisBCgoKDg0OGxAQGi0lIB43LTMtLy0xKystLystKy0tLSstLS0rLS0tLS0wLS0rLS0tLS0tLSstLS0tLS0tLS0tLf/AABEIAOEA4QMBEQACEQEDEQH/xAAcAAEAAgMBAQEAAAAAAAAAAAAAAgYDBAcFAQj/xABLEAACAQIBBAwICgkEAwAAAAAAAQIDBBEFBgcSISIxUVRxcnORk7HRExYkYYGhssIUFTI0UoKSs8HSIyVBQlNig6LDM0SUozVkdP/EABoBAQADAQEBAAAAAAAAAAAAAAACBAUDAQb/xAA4EQEAAQICBAwGAQUAAwAAAAAAAQIDBBEFE0FREhQhMTIzUnGBkbHBFTRTYaHw0SIjQnLhJGLx/9oADAMBAAIRAxEAPwDuIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAa1zlChSajVq06cmsUpzjFtb+zxEaq6aeeXC7ibNqcq64ifvMQw/HVpwmh1sO8jraN8OfH8N9Snzh8+PLThNDrYd41tG+HvHsN9Snzg+PbPhVDrYd41tG+Dj2G+pT5w+fH1nwq362HeNbR2oOO4b6lPnD58f2XCrfrYd411vtQcdw/1KfOHzxgsuF2/Ww7xrrfah7x3D9uPOHzxiseF2/Ww7xrrfag47h+3HmeMdjwu362Peea632oOOYftx5vnjLYcLt+siNdb7UHHLHbjzfPGaw4Zb9ZEa+32oe8bsduPNt2GU6FxrOhWp1dTDW1JKWrjuY4cTJ0101dGc3S3doudCc22SdAAAAxXNxCnFzqSjCCwxlJ4JY7h5NUUxnKFy7Rbp4Vc5R92n8e2nCaP20Q1tG9W+IYX6lPmfH1nwmj9tDW0bz4hhfqU+b58f2fCaP24jW0b3vH8N9SnzPGCy4VR+3Ea6jecfw31I83zxhsuFUOsiNdRvg49hvqR5vnjFZcKodZEa6jfD3j2H+pHmeMdjwqh1kRrqN8HHcP2483zxkseF0OsiNdRvg47h+3HmeMthwuh1kRrre+HvHMP2483zxlsOF2/WRGut74OOWO3Hmy2mXbSrNU6VzRnUljqwjNOTwWLwXEmexcomcolOjE2q54NNUTL0SbsoOkB+UU+ZXtyKOK6UPktP/MU93vKrSZWYkQxyZ4lEMcmEoQkwlEMcmeJQxyYSiGOTCUQg2EohjkzxKGOTCTpGiJfo7p/z0l/bLvL2D5pb2iI/pq8HQS42AAAA8LPb5nPlU/bRwxHVsrTXylXfHq5s2Z74yIY2wlkg2HsQxyYSyQbCUQxthLJBsJZINhKIY2wlkg2HuSw6O1jlGh/LGs31Ul+J2w/WQ0dGx/5FP2z9HZDRfTuf6Q35RS5le3Io4rpQ+T098xT3e8qxRoTqS1acJTlg3qxTk8N/ArREzyQyLVqu5PBojOfszvI93wat1ciWqr3Ss8QxP06vJB5Gu+DV+rkNVXulKMDifpz5IPIt5wav1chqq90pcRxP058kHkS84LX6uQ1Ve6UuI4jsSg8hXnBa/VyGqr3SlxHEdiWGvka7hGU529aMIrGUnBpJb7Z5NuuIzmCrB36Y4U0TlDSjbzksYxbT/bsEFaa6YnKZRlZ1foPpQye62jeg7Or9B9KPMnuto3r3o1yhRtaVeNxUVKU6kXFSxeKUcMdgt4aumiJ4UtnRuNsW6JiuqI5Vx8Z7HhMOiXcWtfb3tL4lhe3B402HCYdEu4a+3vPiWF7cPnjVYcJh0S7hr7e978Rwvbh88a7DhMOiXcNfb3nxHDduHkZ1ZwWle2nSo14TqOUGopSxaUk3ureON67RVRlEs7SuLs3cNNNFUTPJ6qLJlN8vkg2EohCTCUQxyYSiEre3qVZalKEqksG9WKcngt1nsRM8kOtu1Xcng0RnLPLIt5wWv1cu4lq690u/EsR2J8mhcUp05OFSMoTWGMJpxksVisUyMxMckuVVFVE8GqMpYGzwiGNsJZINhKIWzRdHG/x+jQqy/ugvxO+G6xp6Kj+94S66aD6Jz7SK/KKXMr25FHFdKHyunuvp7veWjmS/K/6VT8COG6xDQnzPhPs6AaD60AAAAHl50fMrrmanYcr3V1dyvi+or7pcxyVPGnxSmvWZux8JiIyr8m02HJjbPEohBsJINhKIY2w9QbPEkGwlEJWz2y4mewjX0W22euWTG2EohDd2FuvYXGEojPkh6cc2r6W5bzXKlCPazrqbm5fjRmKn/D0/lb80s3JWutVquLrTjqqMdlQhji1j+1vBdBasWZo5Z527o7ATh86q+lP4hZCw1HKM+X5fX4qX3UTOv9ZL5XSXzVXh6Qr7ZxUsmNsJRCDkEsl20SQxu68vo27j9qpH8pZwvSlq6Kp/uVT9vd1cvN5zzSO/KKXMe/IoYrpQ+W0719Pd7qvZ31ShLwlKWpPBx1sIvYe6tlHCmqaZzhl2L1yzVwrc5S3XnTfcIfV0vyk9fc3+i58Txfb/ABH8N7IGcV5VuqNKpW1oTnhKOpTWK1W91RxOlq9XNcRMrmCx+IuX6aK6s4n7Ru7nQS++leJnhf1be1dWjLVmpwjrYRlsN7Ow0cb9c00ZwpY+9XaszVRPLyKE88sofx11VL8pS4xc3+jD+JYntfiGvd51X1WE6U62MJxcZR8HSWMXurFRxI1X65jKZeV4/EV0zTVVyT9oaeQKmNKfmrVl0SPJ2MzGU5Vx3Q9vJapuvSjWWNKUlGSxcd3YTxW82j2jLhRwuZ5g6bdV+mLsZ0zOU+K8eK1l/CfWVfzF/i9vc+s+EYTsfmf5eZnHm5b07apUoU3GdPCeOvOWME9ssG3+zZ9ByvWKYomaY5lTH6LsUWKq7VOUxy88823nlRWyk+bQbPEntZn5Khc12qsdalTg5SWLji3sRWK2d9+g72LcV1cvM0tGYWm/dnhxnER/8XPxRsP4H/ZV/MXOL293q3vhmF7H5n+VZzwydaW0qNOhS1Kk9ecnrzlhBLBLCTe62/sla/RRRlFMMjS2HsWaaabdOUz38yutldhxCDYSyKUttHlR7RDpb6Ud8O0NGu+8fAAHJM+n+sLj+l9zAzr/AFkvltI/M1eHpCvtnFTiGOTCUQg2EsnQdDkcal5LehQXTKb90tYTpT4e7Y0VHLVPc6gXWy51pKflFLmPfkUMV0ofMac66nu91ObKrGQkwlD0s1H5bbct+yzrZ6yF7R3zNH7sl1g1H2CtaQvmMudpdrK+K6tnaU+XnvhyuTM180xth6zZp1MaVbzXdyv7jtcjLLuhHSFOVyn/AFp9HsSZzUnUsi3nh7elV/bKK1uWtiXrTNS1VwqIl93hL2us03N8cvftbVWmpxlCSxjJOMlvprBk5jOMpWKqYqiaZ5pcevaDpVJ0pfKpzlB+fB4YmRVGU5PhLlubdc0TsnJrNnjyIdF0fWWpbSrNbavNtb+pHar16z9JoYWnKjPe+o0RZ4Fnh9r0j9laCy1XJs5MoeHvqs08YQbpQ5MNjH0vWfpMu7Vwrky+R0ld1t6qdkcnk0JMgzskGw9yQbCUQjKo/pPpYdM53rvoxlirrjodky5hdvg3dDZ5V+HuvJbbbkOfb/WFx/S+5gZ1/rJfL6Q+Zq8PSFebOKrkxth7kg2Eoh07Q1T2l5PfnRj9mMn7xcwnNLa0XTlTVPc6OW2q5xpMflNHmPfkUMV0ofM6b66nu91NkyqxohjkwlD1M035dbc4/ZZ0s9ZC/o6P/Jo/djrRqvrlZ0ifMZc7S7WV8V1bP0n8vPg5S2Zr5pjbPEskcyamNK4815X9aiyzejm7oT0rTlco/wBY91gbOLNiFy0fX2Kq27eymqsF5nsS9er0lzC1c9L6PQd7+mq1Ozlj3/fuuBcb7nGkCz8Hcqqvk14J/XjtZerV6TPxVOVee98xpizwb8V9qPzH7Cswg5SjCKxlKSjFb8m8Eit3MyimapimNrs1lbKlSp0o/JpwjBefBYYmvTTwYiNz7e3RFuiKI2NXOG/+D2tatjhKMGoc5Lax9bRG7XwKJlzxN3VWqq93rscbt3tukyofG18zZbJOcQg2HsQg2E8mNsPcl70XPYu+Oh2VC5hdre0NzV+HuvZbbTjufr/WNzx0vuYGbf6yf3Y+Zx/zNXh6QrzZyVYhjbD2IQkwnEOtaG4+SXEt+5a6KUO8u4Toz3+0NvRvVz3r+Wmi5tpOflNHmPfkUMX0ofNab66nu91Lkyqx4QbCUQ9TNF+XW3OP2JHSx1kL+j/maP3Y66ar6xV9I/zGXO0u1lbFdWoaT+XnwcnkzOfNxCDZ4k18wJ40bj/6ZvpjEt4jnjudtMRldo/1j1lZWyuyXoZuX3gLqjUbwi5ak+RLYePFin6Cdqrg1xK9gL2qxFNWzmnxdWNV9mrWf1l4S0dRLbUJKf1HtZdqfoK+Kpzoz3MzStnh2OFtp5f5VLMay8LeQk1taKdV8a2I+tp+gqYenhXO5k6Ls8O/E7KeX+HUjTfUqHpPyhgqNqnut1przLGMPe6Cli6+aljaXu8lNuO+fZQ6D23SU4YNccjYbJOcQg2EskGwlkxth7EL5orfzvjof5C5hdrd0PzV+HuvxbbLjWfz/WNzx0vuYGbf6yf3Y+bx/wAxV4ekK62clWIY2wlEINhKIdn0RQwydj9K4qy9UY+6X8N0G7gIysrsWF1zTSi/KaPMe/IoYvpQ+b011tPd7qU2VWREMcmeJQ9XNB+X23OP2JHWx1lK9o/5in92OwGq+rVbST8wlztLtZWxXV+ShpLqJ8HJJMzXzsQxykEohp6OZfoK3Op9MEXMV0oWdNx/dp7vda2yqxmOTCWTrebt98ItaNXHGTjqz5cdrLsx9Jq2q+FREvtMHe1tmmvz727c0I1ITpy+TUjKEuJrBk5jOMpd66YqpmmdqtZgZLlQpVpzX6SdaVP6tJuPta3QVsLRwYmZ/cmdozDzaoqmeeZy8uT+VqLTTcXzpyj8Iu61VPGGtqQ3tSG1TXHhj6TJu18KuZfKYy7rb1VWzmjweXQe26SEc6rVHI2GyTnkg2EskN14LZb2Et9hKIz5G/LIF9wS56qfcT1de6Vril/sSumjSwr0fhXhqNSlreA1fCQlDWw18cMd3dXSWsNTMZ5w1tGWq7cVcOMs8vddy01XKM9shXlW+uKtK2rVKcnT1Zxg5ReFKCeHpTKF63XNczEfuTDxmGu13qqqac45PRWbzI13Si6lW2r06ccMZzpzjFYvBYtrDdaOM0VRGcwqVYe5TGdVM5PNbIoZISYSyd00VwwyXbv6Uq8v+6a/A0MP1cePq3sF1Mfu1bTutOZaU35TR5j35FDF9KHzumetp7vdSGyoyGOTCUPWzOfl9rzj9iR1sdZSvaP+Yp/djsZqvqVV0l/MJc7S7WVsX1fko6R6ifByJszXz0QwXEsIye9GT9R7HO6URnVDU0cy/R11/PB/2vuLmL54WNNx/XR3StjZUYsQg2Hq7aNr/ZrWze9WguiM/dLmEq56W/oa70rc98e/svRdbr4lhued9O6B5WdWUPg9pWqp4S1dSHLntU/Rjj6Dler4FEyr4q7qrNVTirZkvlMn2g9t0nsc5VHIzyZNzyQbCUQ+28tvDlw9pHsc7rb6cd8O9s1n2D4AAAVrSN/4y5/o/fwON/q5Vcb1FXh6uItmcwYhBsJZP0Ho8p6uS7Nb9LW+1OUvxNKzH9uG/hoytUrEdXdzDSq/KaHMf5JFDF9KHz2mOtp7vdR5MqMmIY2wlBSrzhJThKUJx2Yzi3GSfma3BEzE5w6UVTTOdM5S2nnBe8Lueuqd5PW175d4xN7tz5te8yxdVY+Dq3FapDFPUnUlKOK3HgyM3KqoymXtV+5XGVVUzDzmyLnENW/nhSqvepz9lkrfLVDtZjO5TH3j1aujqWxcrz0n7ZcxexY03HLRPf7Le2U2Hkg2ePW9m9lD4PdUazeEVNRnveDltZdCePoOlqvg1xK3g7uqvU1bNvdLsprPrwDnmlPKO2oWqe4nXmvO8Yw9Wv0oo4yvlinxY2lbvRtx3/w582UmPEPtF7bpPY5yqORnbJucQg2EohByCUNp5au+F3PX1e8lw6t8+crGvu9ufOUHlu84XddfV7xw6t8+cvdfd7c+coPLt5wu66+r3jh1b585S193tT5yi8vXvDLr/kVe8cOrfL3XXe1PnLDc5ZuqkXTqXNxUhLDGE61ScHg8Vim8HspCa6p5Jl7N25VGU1T5vOciKOTHKQSiH6SzOp6uTrFf+pbv0umn+JqWuhDfs9XT3Q9gm6uXaWH5TQ5j/JIz8X0ofP6X6ynu91FbKrKY5MJRCEmeJQxyYSiGNsJRCEmeJZNLKsv0NXm59h0tdOO9Yw8f3ae+Gto8ezccVLtkXMXsdtNc1Hj7Li2UWFkg2Eohjkwku1lpDdOlTpztnOcIRhKp4VR12lhrYauxiXKcXlERMNq3pbg0xE05zH3/AOMr0lrgb69fkPeOf+rp8Wjsfn/ik5dynK6uKlxJavhGsIY62pFJJRx4kVLlfDqmpmX7s3rk1ztea2Qc4gpzSeLaS328Ee085MTMcjPrp7jx4tkmhkhJh6g2EsmNsJRCDYSyY3IJRCDYSiGOTCUQhJhLJjnIJRD9RZGp6ltbw+jQox6IJGtTzQ36IypiG4epKHpAzbu7yvSnb04yhGlqylKcIJS128MG8dxlTEWq66omlk6Qwl29XE0RzQrsNHGUHuu3jyqkvwizhxW59v3wU40Ve+zZp6L7p/LuaEeSqk+1IlxOrfDtToqvbVDZp6KX+9erijb/AIuZKMHO2r8f9dI0Vvr/AB/1t09FVt+/dV3yVTj2pkowdO+XWNGW9sy2qOi/J6+VK5nyqkV7MUSjCW/u6U6OsxvbdPRzkpbtvKXKr1vwkiXFbW71dIwNjd6tqOY2SknH4DRkmsGpqVTFfWbJ02bdPLEOtOHtUznFKr6QcgWVpRoytbS3t3Kq4ylRo06UpLUbSk4rZOGL5oZumY/t0z9/ZRGyi+fiGNsJINhJBs8ewxthKIQbCUQg2EmOWzsPc3glCu5UyI1jUt8U91008Ps9xctYnZX5tXD43P8Apu+f8vEV9Xi8PC1U1sYa8lh6C5wKJ2Q0Js2qv8Y8ofobRBkK0vckUa11QhWqupXTqyxVRpVGknJNPcI6m3uR4pZ7MLRW0c5LluUZw5Nar+LZGcNbnZ+Zc+IWN3q86vopsX8itdQ82tSkvXDH1kZwtO+UJ0da2TLzbjRFF/6d9JeadBS9amiE4TdLnOjo2VPNudEd2v8ATureXLjUp9ikRnC1bJRnR9WyXmXGi3Kkfkq3qcith7SRHi1aPEbkbnl3GYGV4btlN8ipRn7MmR1FzchxS7Gx5dzm1lCGxKxu15/g9VrpSwI6uuNjzU1xsl+mqccEo7yS6EajbSAAAAAAAAAAMF3ZUayUa1KnVinio1IRmk99JrdI1UxVzwhXborjKuInvedUzWyfLdtKH1YKPYQ1Fvsw4zg7E/4Q1KuY2TJf7bDk1a0fUpYEZw1udnq5zo7Dz/j+Z/lq1dHWTpbka0OTVb9rEjxS2hOjLE7J82nV0YWb+TXuo8cqUl7BGcHTvn8fwh8KtbJn8fw062iqk/kXlRcqlGfY0R4nHaRnRVOypp1dFFT929g+VQceybI8Tntfj/qHwue1+GlW0VXv7le1lynVh2RZGcHXvhGdGXNkw0q2jHKa3Pg8+TVa9qKIzhLn2efDrsbmhW0e5Wj/ALXWW/GtQfbLEjOGu7kJwV6Nno8LLGjfKM05OyrRqL96CjPHzPVbxO1rXW9nIs2IxFnkmnOP3mdg0N5Mr2uSqVC5pTo1Y1bhunOLjLB1G08H+xovROcZtSmc4zXc9egAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/2Q==",
            rateCards: [
                {
                    title: "Morning Prime Time",
                    item: "",
                    time: "6:00AM - 9:00AM",
                    price: "RWF 2,950 per Second",
                    imageUrl: "path/to/kc2-entertainment.png"
                },
                {
                    title: "Evening Prime Time",
                    item: "",
                    time: "8:00PM - 10:00PM",
                    price: "RWF 2,950 per Second",
                    imageUrl: "path/to/kc2-entertainment.png"
                },
            ]
        }
    ],
    billboards: [
        { 
            id: 'alliance-media', 
            name: 'Alliance Media', 
            icon: MapPin, 
            iconUrl: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAARMAAAC3CAMAAAAGjUrGAAABPlBMVEX////cBjDXABrutL3vtbzaBjDeACfeACr8/////v/XW3TcBi////3bACvbACneBjH22eDJABTntcTSABL/6fJNMUHYACLYdIncADTppq3YDC/nhZXaAB7ksLvpprT/+f/WY3PYUmr43OXZMk/XW3LKABz/7fnQAADcABv/9PnmorHilKHzxMvUACnyzNXPABvMDDfJDy/cfInyxNPbc4HnrLrQDjj34uXcHRTTAwDddoveU2jaQ1vYV2bcOFLOLkrgipb2YhD6zrjTV179eCj7oVn/9O3YbXPIKED3bxPfgibt4tvni3zPQVzQS13eOxr/hxLSayJsQCs/ITQtACD206Pfb4bn4ubxgEhaNyzGwsfCACXmnKTpnLH7cCY3FyuFe4Q1Bi7meSfCaSrlhItVMjL4bRczJDv/jRjUP0ZCOXqpAAAJrklEQVR4nO2aa1vbyBWARyKjC6PR2MgIxQhsg8CWbVmYi40JrEnrZklaDGy2pCmb9JJusvv//0DPjGQuu9lNW+xmw3PeD4li6zLz6syZMxMTgiAIgiAIgiAIgiAIgiAIgiAIgiAIgiAIgiAIgiAIgiAIgiAIgiAIgiAIgiAIgiAIgiAIgiAIgiAI8nHsz92AaeI4U7iJZVlTuMtvBWsaTiwrntubezA8iskUpPS3PP3h4HVLzv1zwbahPSCosTSF/BgZ9HN3ZIowd57cPz/Om/QhSTGiL9MJPJAJoWliBveekpMZtOzXodTQZWI3gunf2pi/t5HP4YTrW9urO4Wdvd2yzqd8b+nk/pPx/9kJ1fytBVvGN9SKlb2eT6caLNOJk2iKc/GnEwSj+rYUUin1+xV4eryrf8TJ/57gZuIExrrLVd8ocw2DqeYJbros+9CEr3MBruvm13D4MFB9g0u4OhCBZrqGKwJK5YkSBtlceC1QUtjd2q8Ptg7W4HhZF0Hgu5zTXBqHw4AK0+UmHLo0yK6HB8PH6hxj0pgA2kXvTBEzGTt8fXd7Pe91rVrtqQP3SbWafZgcVquHqvki2d0+8rN+wIdPQtlMDid+pRrpesPd4+PdYUgDBvfJ6FH/GGJkadDgT2u/OxoMlqG+2g213mW1eqRn+v0jOC8I6OSaIOCH6uBomPryGaxXrdZo9i6e7O6W7wTVLJywxh4hq6p5YmOTkJoy4RUIWVLx5C3A16H82hxD5KdZN1bhPjUXQl5vE7IMooRe62TlZNPX9LX8UXFiDiuO/XvPH6V/cCzybFj/2rEqXZ6U4NuqD0FK3RocrkPo5NdsbtDGSnZYKS178DrcI/mpCpS0D5fx8mydULERW07cVSaKJdlTppw4mROmg5OmdCL0Fcsml4Zy8hjW6PEJh2ShnFCqt0heJqw0GBjNmnnsem1iVQejjeejF3+0HPKnpx5kl7kUogfWolswZkRagpPXeVC2bSV1TtfC3Akk5bUtrpngpFRUUXkE53a8n46d+zN/ezpk/qXcO4BuTZzcjZMbJ1oZ3rjVSUXuxLIKnpg48Q9g0bG2fXoazTUNdXVrXKtFPXNIrM4gOTu/+Oblt68c8udBMuhbds9Yh0U+6dRZ4Delv3UGTiDV1WpHJ4JKJ+1adFyQDykKs0aczAk0xnHIkE/fye044V6H2LbV937diSaEvw2xYZFDd+LEIQte7oR3KxbpFCFxGqHLZJyQS980WWC0LGd8Nnp68XJx8dtXhDz7y/P9S4sc+F7fhldxrLtj6Lc9cRIY3ISCVwcnq55reI/B16UxcSIYPMZ2SLMx27GjXmTHIjXzU07gIxsifk/PnfSJ7FPmxF8mxIYXDKcBysluvVhMAn3HiuuJd/56UTn56zfPU7/rOCsh3NaG/h16MBPBmIF8Ip1ceXBR7sQPAlFfc6wd3YzyOJGPacZWnIiZOgmblrV8qUbxJJ98dOxQfkggjitO5UpkTr6bAw9HdeWkAScVroe5chKXSvEb3yuRzv7bkQyTxb+9+vs/Xv7z/C1oKOgwZGxI7gVIQysxmTiJNzc3Dwwtd0KpzOWl1Jg40eG+wwW52yHuOLk/t52wYmxVelexZUMuu5Njf+JEhHsW2a634Q+oFaSTVW8N0uSGcgIDkHTCQNxyImmGemztpMnZuw+LUsri4oeL/QROXgv9N4TUCzB87PgqdjIn2by1bbDcCbyxYzl3TZzwU5BYr0r9M8wn1LgkTn95uW+RVjgZO3ecaBMnV7FNWssrxForMqqc+CcyiWRO2rKhgRA3TgrtdnvJ0PsyTs5VnEhevsjjJAQn3kkFxt+l98zJ8olN2gvtdsSv44TJ55Sux46sGjr/aoG6Q3Zd+U7dSeB1LPV2HFKC0P9FJz41DvINcpsccS1zElZlTpBO9CZ8M9TyAjPLsYMwNITesUp1Xx99nzt5PdJ9mPwXdHnbNDyA+cVL4ut5p6yHoRtcOzGLJctaCN3MCYML8x21ufR60TT1fCJObvYeIjdz4htQwSsnDVme53EiRwfJnCzouROmt9TlMO9AVEPdYHA57+ROGlCmi/CNRU710fts8Cy+vHg+CiN5BYwbknKvudPjt5z0oOLneY5tcKO+Ct0d88yJJl9L3oZKT5uZkxA61U7LibdHnI6nnGwf1aIa96DJrXEURb0sTvgQarSrcjmBqdPuBtLJY1jgyjGj6lhZmpFCdTisLrwJ2aQ+qfVMyMwrUJ/88O77Dx8+vL74IXUHEJonRg8MpJCY4IWn8e36pDYuKycLtWgZ6hOypwdczsUbTLZpKUmSIlTJx8ZtJ/fnxgkrlhwS+ULILkMpVCxlyitpo5D/J1A3cwLTBExNDMoZaFDLz+IE4jfpKydl1l2Tl1agX6VE1bHqRlDHdhy7Fo72349evLsYPT1761UJ2dHlrApOoIwObjtRbKkcmzOXBpTLOnZD6o03KGNyBdUvihk5catyqpNjSA6NVT3dzM6opHo+c5BeqNY7PWj32IQcKjuzmYSrMk5gLcshTYITxtyNx6pPVrwK73vydSmV73jzRy8Zpedn5+ko0X+MHXuYuUyzta5r31nvkC1NPlMS79Q8kTnZ3Ahh7oeggaqlC8+smrecTHPsyPXnocqL/KtqNUrkenZ+PqpGVC53s4VtWZ7D5DoWiimhsUB+qC5U61MXjr6CrBxoae/r1nfHUVdnAb1ZF4tGk1ib4/19+jZ5z88G1YoDlR7tyS+TrFNleZ4WBNH1uhiW3fIfpz1PFgZUrouflJMogqU6lIVBUpNL9VnlE80web4IdyEjCtc1DNc0TGiWAX+ZLte43CCBetdwA+kE2gApWJjwoaxaKTPN/CgQZuj7LhXQPe5CspQ3owGtwxqFLJymA2+wMd6B41WoLljimvlWOdVM14VhKEy5ewKXsUC4hik3ULjIplwq909o4nI1BcPX6pmzcnI9Af38o1+A/cdn5ncOvJZsdKnTLsh05RzXZfkv5DbBzfoWTLLJzWVoZP+Sf3xqp/LL3KMWjXFHrfslnaFO6c+dBMEdJ+KhO5FbcONmZ6201m4NPTbl/1z6IvftFdz39DTVfblbi04UchRAgoZMrN1nj/5jfKlj5wbGfptOos/jRG03/dfT1qdg0/ldwbY/5XZ9VoSxpHbq7oXT7z6k3ynp3dIUftFmxY/m5h49FOZiYt978Dg3P3u0HgIEBs4Ufsn5kH4fO41fxyIIgiAIgiAIgiAIgiAIgiAIgiAIgiAIgiAIgiAIgiAIgiAIgiAIgiAIgiAIgiAIgiAIgiAIgiAI8jD5N4SkKTM2+2tUAAAAAElFTkSuQmCC",
            rateCards: [
                {
                    title: "KG17",
                    road: "KG 11 Avenue",
                    closestLandmark: "Amahoro Stadium",
                    location: "Opposite Amahoro Stadium next to FortBet",
                    size: "3mX6m",
                    format: "Scroller",
                    audienceCount: "98,000 / Day",
                    monthlyRental: "RWF 800,000",
                    monthlyInsurance: "",
                    production: "RWF 243,000",
                    flighting: "RWF 135,000",
                    freight: "",
                    imageUrl: "path/to/kg11-billboard.png"
                }
            ]
        }
    ]
};

export const tabs = [
    { id: 'all', label: 'All' },
    { id: 'websites', label: 'Websites' },
    { id: 'tv', label: 'TV' },
    { id: 'billboards', label: 'Billboards' }
];