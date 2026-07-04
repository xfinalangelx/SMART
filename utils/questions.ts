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
      "HIV is not present in sweat, tears, urine or faeces in amounts that can infect another person. HIV is only transmitted through specific bodily fluids — blood, semen, vaginal and rectal fluids, and breast milk — so you cannot get HIV from contact with these other bodily fluids.",
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
      'You cannot get HIV from insects or animal bites. When an insect such as a mosquito bites you, it injects its own saliva and sucks your blood — it does not inject the blood of the last person or animal it bit. HIV also cannot survive or reproduce inside insects. HIV stands for Human Immunodeficiency Virus, which means the infection can only be passed between humans.',
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
  {
    id: 17,
    question: 'Taking your HIV medication (ART) every day as prescribed is important',
    options: ['Myth', 'Fact'],
    answer: 'Fact',
    explanation:
      'Taking antiretroviral therapy (ART) exactly as prescribed, every day, keeps the amount of virus in your body low and protects your immune system. Missing doses can allow the virus to multiply and become resistant to the medication, which makes it harder to treat. Good adherence is the single most important thing you can do to stay healthy.',
  },
  {
    id: 18,
    question: 'A person living with HIV who is on effective treatment can live a long, healthy life',
    options: ['Myth', 'Fact'],
    answer: 'Fact',
    explanation:
      'With effective antiretroviral treatment, people living with HIV can expect a near-normal life expectancy. Modern treatment keeps the virus under control, protects the immune system, and allows people to work, have relationships and families, and live full lives.',
  },
  {
    id: 19,
    question: 'A mother living with HIV will always pass HIV to her baby',
    options: ['Myth', 'Fact'],
    answer: 'Myth',
    explanation:
      'With the right care, the risk of passing HIV from mother to baby can be reduced to less than 1%. This includes taking antiretroviral treatment during pregnancy, appropriate delivery care, medication for the baby after birth, and following medical advice about feeding. Speak to your healthcare provider about planning a pregnancy.',
  },
  {
    id: 20,
    question: 'PrEP (pre-exposure prophylaxis) can help HIV-negative people avoid getting HIV',
    options: ['Myth', 'Fact'],
    answer: 'Fact',
    explanation:
      'PrEP is medication taken by people who are HIV-negative to greatly reduce their risk of getting HIV. When taken as prescribed, it is highly effective. PrEP does not protect against other sexually transmitted infections, so condoms are still recommended. Speak to a healthcare provider to find out if PrEP is right and available for you.',
  },
  {
    id: 21,
    question: 'HIV and AIDS are exactly the same thing',
    options: ['Myth', 'Fact'],
    answer: 'Myth',
    explanation:
      'HIV is the virus that can weaken the immune system. AIDS is the most advanced stage of untreated HIV infection, when the immune system is badly damaged. Not everyone with HIV develops AIDS — with effective treatment, most people living with HIV never progress to AIDS.',
  },
  {
    id: 22,
    question: 'You should stop taking your HIV medication once you feel well',
    options: ['Myth', 'Fact'],
    answer: 'Myth',
    explanation:
      'Even when you feel completely well, the virus is still in your body. Stopping treatment allows the virus to multiply again, damage your immune system, and potentially become resistant to medication. HIV treatment is lifelong — never stop or change it without discussing it with your doctor first.',
  },
  {
    id: 23,
    question: 'Regular blood tests are an important part of managing HIV',
    options: ['Myth', 'Fact'],
    answer: 'Fact',
    explanation:
      'Regular blood tests such as CD4 count and viral load help your healthcare team check that your treatment is working and that your immune system is healthy. Other tests (kidney, liver, blood sugar and cholesterol) help monitor your overall health and catch any side effects of medication early.',
  },
  {
    id: 24,
    question: 'People living with HIV can safely share meals and living spaces with others',
    options: ['Myth', 'Fact'],
    answer: 'Fact',
    explanation:
      'HIV is not spread through everyday contact. Sharing meals, dishes, bathrooms, living spaces or hugging someone living with HIV carries no risk of transmission. HIV can only be passed through specific bodily fluids.',
  },
  {
    id: 25,
    question: 'Only your doctor can change your HIV medication or dose',
    options: ['Myth', 'Fact'],
    answer: 'Fact',
    explanation:
      'Never change, stop or adjust your HIV medication on your own, and be careful with other medicines, supplements and herbal products, which can interact with ART. Always check with your doctor or pharmacist before starting anything new.',
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
