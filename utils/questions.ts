export type TriviaQuestion = {
  id: number;
  question: string;
  options: string[];
  answer: string;
  explanation: string;
};

const initQuestions: TriviaQuestion[] = [
  {
    id: 1,
    question: 'Herbal medication can be used to treat HIV',
    options: ['Myth', 'Fact'],
    answer: 'Myth',
    explanation:
      'Can herbal medicine cure HIV? No. Some people choose to take alternative forms of medicine, such as herbal medicines, as a natural way of treating HIV. However, herbal remedies do not work. Taking herbal medicines can be dangerous as they will not protect your immune system from infection. They may also interact poorly with antiretroviral if you are taking them alongside treatment. The only way you can stay healthy when living with HIV is to take antiretroviral treatment as prescribed by your doctor or healthcare professional, and to attend viral load monitoring appointments (if available to you) to make sure your treatment is working.',
  },
  {
    id: 2,
    question:
      'You can get HIV from touching, kissing, hugging or shaking hands with someone who has HIV',
    options: ['Myth', 'Fact'],
    answer: 'Myth',
    explanation:
      "You can only get HIV from someone who is already living with HIV. HIV can only be transmitted through specific bodily fluids so you can't get HIV from touching someone, hugging them or shaking their hand. There is such a small amount of HIV in the saliva of a person living with HIV that the infection can't be passed on from kissing.",
  },
  {
    id: 3,
    question:
      'HIV can be transmitted through sweat, tears, urine or faeces from a person who is infected with HIV',
    options: ['Myth', 'Fact'],
    answer: 'Myth',
    explanation:
      "Sweat, tears, urine or faeces of someone who has HIV can't be transmitted through sweat, tears, urine or faeces from a person who is infected with HIV",
  },
  {
    id: 4,
    question:
      'You can get HIV from swimming pools, baths, shower area, washing clothes',
    options: ['Myth', 'Fact'],
    answer: 'Myth',
    explanation:
      "HIV can't survive in water, so you can't get HIV from swimming pools, baths, shower areas, washing clothes or from drinking water. You can't get HIV from insects. When an insect (such as a mosquito) bites you it sucks your blood only – it does not inject the blood of the last person it bit. HIV stands for Human Immunodeficiency Virus, which means that the infection can only be passed between humans.",
  },
  {
    id: 5,
    question: 'You can get HIV from mosquitoes or animal bites',
    options: ['Myth', 'Fact'],
    answer: 'Myth',
    explanation:
      'Not everyone has symptoms when first infected with HIV. Many people have flu-like symptoms, called "acute retroviral syndrome" (ARS) or "primary HIV infection," within 2 to 4 weeks of being infected with HIV. Symptoms may include fever, swollen glands, sore throat, rash, fatigue, muscle and joint aches, and headache. Symptoms may last a few days to a few weeks. However, these symptoms resemble many other infections and the only way to know for sure if you are infected with HIV is to get tested.',
  },
  {
    id: 6,
    question:
      'Everyone will experience flu-like symptoms (acute retroviral syndrome) within 2-4 weeks of being infected with HIV',
    options: ['Myth', 'Fact'],
    answer: 'Myth',
    explanation:
      "The symptoms of HIV can differ from person-to-person and some people may not get any symptoms at all. Without treatment, the virus will get worse over time and damage your immune system over time. There are three stages of HIV infection with different possible effects. Also, you also can't tell by looking at someone whether they have HIV or not. Many people don't show signs of any symptoms. And, for people living with HIV who are on effective treatment, they are just as likely to be as healthy as everyone else.",
  },
  {
    id: 7,
    question: 'It is easy to tell the symptoms of HIV',
    options: ['Myth', 'Fact'],
    answer: 'Myth',
    explanation:
      "The symptoms of HIV can differ from person-to-person and some people may not get any symptoms at all. Without treatment, the virus will get worse over time and damage your immune system over time. There are three stages of HIV infection with different possible effects. Also, you also can't tell by looking at someone whether they have HIV or not. Many people don't show signs of any symptoms. And, for people living with HIV who are on effective treatment, they are just as likely to be as healthy as everyone else.",
  },
  {
    id: 8,
    question:
      "I'm HIV-positive and so is my partner so we don't have to worry about HIV",
    options: ['Myth', 'Fact'],
    answer: 'Myth',
    explanation:
      'There are many strains of the HIV virus. If you and your partner are living with HIV you may each have a different strain and so would still need to protect each other from additional HIV infections. If you get infected with two or more strains of HIV it can cause problems for your treatment. If you are on effective treatment and a medical professional has confirmed your viral load is undetectable, you will not pass HIV on through sex.',
  },
  {
    id: 9,
    question: 'There is NO cure for HIV',
    options: ['Myth', 'Fact'],
    answer: 'Fact',
    explanation:
      'No drug can cure HIV infection, but there are antiretroviral medications that can help control the virus and protect your immune system, and possibly prevent HIV from becoming AIDS.',
  },
  {
    id: 10,
    question: 'Undetectable = Untransmissable (U+U)',
    options: ['Myth', 'Fact'],
    answer: 'Fact',
    explanation:
      'Someone who has an undetectable viral load. If a healthcare professional has confirmed that someone living with HIV has an undetectable viral load (meaning effective treatment has reduced the amount of virus in their blood so that it cannot be detected through a blood test) there is no risk of transmission.',
  },
  {
    id: 11,
    question:
      'HIV cannot be transmitted (passed on) through sharing food, drinks, cooking utensils, cough, sneeze or spit',
    options: ['Myth', 'Fact'],
    answer: 'Fact',
    explanation:
      "HIV can't survive in air so you can't get it from sharing a space with someone who is HIV-positive. There is only a trace of HIV in these bodily fluids so they can't transmit HIV. HIV can't be passed on through sharing food, drinks or cooking utensils, even if the person preparing your food is living with HIV.",
  },
  {
    id: 12,
    question:
      'You cannot get HIV from sharing toilet seats, tables, door handles, cutlery or towels',
    options: ['Myth', 'Fact'],
    answer: 'Fact',
    explanation:
      "Toilet seats, tables, door handles, cutlery, sharing towels. You can't get HIV from any of these as it can only be transmitted through specific bodily fluids.",
  },
  {
    id: 13,
    question:
      'You can get HIV from using an unsterilized needle for tattoos and piercings',
    options: ['Myth', 'Fact'],
    answer: 'Fact',
    explanation:
      'There is only a risk if the needle used by the professional has been used in the body of someone living with HIV and not sterilised afterwards. However, most practitioners are required by law to use new needles for each new client.',
  },
  {
    id: 14,
    question: 'HIV only a risk for certain groups of people',
    options: ['Myth', 'Fact'],
    answer: 'Myth',
    explanation:
      'Like most illnesses, HIV does not discriminate between types of people and the infection can be passed on to anyone. Some people are more vulnerable to HIV infection if they regularly engage in certain activities (for example injecting drugs) they are more likely to get or transmit the HIV virus. However, it is NOT TRUE that HIV only affects certain groups.',
  },
  {
    id: 15,
    question:
      'If bodily fluid from a HIV-infected individual gets into my body I will definitely get HIV',
    options: ['Myth', 'Fact'],
    answer: 'Myth',
    explanation:
      "HIV is not always passed on from someone living with HIV. There are lots of reasons why this is the case. For example, if the HIV-positive person is on effective treatment it will reduce the amount of HIV virus in their body. If a doctor confirms that the virus has reached undetectable levels it means there is no risk of passing it on. If you're concerned that you've been exposed to HIV, please visit your doctor. You may be eligible to take post-exposure prophylaxis (PEP), which stops the virus from becoming an infection. However PEP may not be available everywhere and has to be taken within 72 hours of possible exposure to be effective.",
  },
  {
    id: 16,
    question: 'The risk of getting infected with HIV through oral sex is low',
    options: ['Myth', 'Fact'],
    answer: 'Fact',
    explanation:
      'The risk of HIV from oral sex is very small unless you or your partner has large open sores on the genital area or bleeding gums/sores in your mouth.',
  },
];

// Shuffle function to randomize questions
function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  let currentIndex = shuffled.length;

  while (currentIndex !== 0) {
    const randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [shuffled[currentIndex], shuffled[randomIndex]] = [
      shuffled[randomIndex],
      shuffled[currentIndex],
    ];
  }

  return shuffled;
}

export const getShuffledQuestions = (): TriviaQuestion[] => shuffle(initQuestions);
export const questions = shuffle(initQuestions);
export default questions;
