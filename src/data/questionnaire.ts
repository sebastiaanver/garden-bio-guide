import { Section } from "@/types/questionnaire";

export const questionnaireSections: Section[] = [
  {
    id: "general",
    title: "General Information",
    questions: [
      {
        id: "landSize",
        text: "What is the approximate size of your land?",
        type: "single",
        options: [
          { label: "Small (Less than 500 m²)", value: "small" },
          { label: "Medium (500 m² - 2000 m²)", value: "medium" },
          { label: "Large (More than 2000 m²)", value: "large" },
        ],
        section: "general"
      },
      {
        id: "landUse",
        text: "What is the main use of your land?",
        type: "single",
        options: [
          { label: "Private garden", value: "private_garden" },
          { label: "Agricultural land", value: "agricultural" },
          { label: "Mixed-use (garden + small-scale farming)", value: "mixed" },
          { label: "Other", value: "other", allowCustom: true },
        ],
        section: "general"
      },
      {
        id: "currentMeasures",
        text: "Do you currently take measures to promote biodiversity?",
        type: "single",
        options: [
          { label: "Yes", value: "yes" },
          { label: "No", value: "no" },
          { label: "Not sure", value: "not_sure" },
        ],
        section: "general"
      }
    ]
  },
  {
    id: "habitat",
    title: "Habitat Features and Vegetation",
    questions: [
      {
        id: "vegetationTypes",
        text: "What types of vegetation are present on your land? (Check all that apply)",
        type: "multiple",
        options: [
          { label: "Lawn/grass", value: "lawn" },
          { label: "Wildflower meadow", value: "wildflower" },
          { label: "Native trees and shrubs", value: "native_trees" },
          { label: "Exotic/non-native plants", value: "exotic" },
          { label: "Vegetables/fruits (e.g., in a garden or orchard)", value: "vegetables" },
          { label: "Other", value: "other", allowCustom: true },
        ],
        section: "habitat"
      },
      {
        id: "nativeSpecies",
        text: "Do you plant native species to support local biodiversity?",
        type: "single",
        options: [
          { label: "Yes, mostly native plants", value: "mostly_native" },
          { label: "Some native, some non-native", value: "mixed" },
          { label: "No, mostly non-native", value: "mostly_non_native" },
        ],
        section: "habitat"
      },
      {
        id: "vegetationHeight",
        text: "Is there a mix of vegetation heights (e.g., ground cover, shrubs, trees)?",
        type: "single",
        options: [
          { label: "Yes, diverse vegetation layers", value: "diverse" },
          { label: "Some variation, but not many layers", value: "some_variation" },
          { label: "Mostly uniform height (e.g., lawn only)", value: "uniform" },
        ],
        section: "habitat"
      }
    ]
  },
  {
    id: "wildlife",
    title: "Wildlife Habitats",
    questions: [
      {
        id: "wildlifeFeatures",
        text: "Do you have any of the following wildlife-friendly features on your land? (Check all that apply)",
        type: "multiple",
        options: [
          { label: "Hedgehog house", value: "hedgehog_house" },
          { label: "Birdhouses", value: "birdhouses" },
          { label: "Bat boxes", value: "bat_boxes" },
          { label: "Bee hotel", value: "bee_hotel" },
          { label: "Log piles or brush piles (for insects and small mammals)", value: "log_piles" },
          { label: "None", value: "none" },
        ],
        section: "wildlife"
      },
      {
        id: "waterFeatures",
        text: "Do you have any water features?",
        type: "single",
        options: [
          { label: "A natural pond or stream", value: "natural_pond" },
          { label: "A man-made pond", value: "man_made_pond" },
          { label: "No water feature", value: "no_water" },
        ],
        section: "wildlife"
      },
      {
        id: "foodSources",
        text: "Do you provide food sources for wildlife (e.g., flowers for pollinators, fruit trees, bird feeders)?",
        type: "single",
        options: [
          { label: "Yes, year-round", value: "year_round" },
          { label: "Yes, but seasonally", value: "seasonally" },
          { label: "No", value: "no" },
        ],
        section: "wildlife"
      }
    ]
  },
  {
    id: "management",
    title: "Land Management Practices",
    questions: [
      {
        id: "grassManagement",
        text: "How do you manage grass and lawns?",
        type: "single",
        options: [
          { label: "I mow regularly and keep it short", value: "mow_regularly" },
          { label: "I leave some areas uncut to support wildlife", value: "leave_uncut" },
          { label: "I use rotational or phased mowing to encourage biodiversity", value: "rotational_mowing" },
        ],
        section: "management"
      },
      {
        id: "chemicalUse",
        text: "Do you use chemical pesticides or herbicides?",
        type: "single",
        options: [
          { label: "Yes, frequently", value: "frequently" },
          { label: "Occasionally", value: "occasionally" },
          { label: "No, I use natural pest control methods", value: "natural_methods" },
        ],
        section: "management"
      },
      {
        id: "soilHealth",
        text: "How do you manage soil health and fertility?",
        type: "single",
        options: [
          { label: "I compost and use organic matter", value: "compost" },
          { label: "I use chemical fertilizers", value: "chemical_fertilizers" },
          { label: "I don’t actively manage soil health", value: "no_management" },
        ],
        section: "management"
      }
    ]
  },
  {
    id: "connectivity",
    title: "Connectivity and Sustainability",
    questions: [
      {
        id: "landConnectivity",
        text: "Is your land connected to other green areas (e.g., hedgerows, corridors to forests, neighboring gardens with biodiversity-friendly features)?",
        type: "single",
        options: [
          { label: "Yes, well-connected", value: "well_connected" },
          { label: "Somewhat connected", value: "somewhat_connected" },
          { label: "No, isolated", value: "isolated" },
        ],
        section: "connectivity"
      },
      {
        id: "wildlifeBarriers",
        text: "Are there any barriers that prevent wildlife movement (e.g., solid fences, walls without openings, roads)?",
        type: "single",
        options: [
          { label: "Yes, many barriers", value: "many_barriers" },
          { label: "Some barriers, but with openings", value: "some_barriers" },
          { label: "No, my land is accessible to wildlife", value: "accessible" },
        ],
        section: "connectivity"
      },
      {
        id: "sustainableUse",
        text: "Do you have any areas dedicated to sustainable land use (e.g., permaculture, regenerative farming, water retention features like a wadi)?",
        type: "single",
        options: [
          { label: "Yes", value: "yes" },
          { label: "No", value: "no" },
        ],
        section: "connectivity"
      }
    ]
  },
  {
    id: "future",
    title: "Future Plans",
    questions: [
      {
        id: "improvements",
        text: "Are you interested in making improvements to enhance biodiversity?",
        type: "single",
        options: [
          { label: "Yes, I’m actively looking for ways to improve", value: "actively_looking" },
          { label: "Maybe, but I need more information", value: "maybe" },
          { label: "No, I’m satisfied with the current state", value: "satisfied" },
        ],
        section: "future"
      },
      {
        id: "aspectsToImprove",
        text: "Which aspects of biodiversity would you like to improve? (Check all that apply)",
        type: "multiple",
        options: [
          { label: "More wildlife habitats (e.g., birdhouses, bee hotels)", value: "wildlife_habitats" },
          { label: "Increasing plant diversity", value: "plant_diversity" },
          { label: "Water retention and sustainable management", value: "water_retention" },
          { label: "Reducing pesticide use", value: "reducing_pesticide" },
          { label: "Encouraging pollinators", value: "encouraging_pollinators" },
          { label: "Other", value: "other", allowCustom: true },
        ],
        section: "future"
      }
    ]
  }
];
