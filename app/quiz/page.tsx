'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Coffee, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { QuizStep } from '@/components/quiz/quiz-step';
import type { QuizAnswers } from '@/lib/types';

// Quiz questions configuration
const questions = [
  {
    id: 'milkPreference',
    question: 'How do you usually take your coffee?',
    description: 'There are no wrong answers here - we just want to find what you like.',
    options: [
      { value: 'black', label: 'Black', description: 'Just coffee, nothing added' },
      {
        value: 'with-milk',
        label: 'With milk or cream',
        description: 'A splash of dairy or plant milk',
      },
      { value: 'sweetened', label: 'Sweet and creamy', description: 'Milk plus sugar or flavors' },
    ],
  },
  {
    id: 'temperature',
    question: 'Hot or iced?',
    description: 'Some like it hot, some like it cold.',
    options: [
      { value: 'hot', label: 'Hot', description: 'Classic and cozy' },
      { value: 'iced', label: 'Iced', description: 'Refreshing and cool' },
      { value: 'both', label: 'Both!', description: 'Depends on my mood or the weather' },
    ],
  },
  {
    id: 'flavorPreference',
    question: 'Which flavors appeal to you more?',
    description:
      'This helps us match you with the right coffee beans and roast level. (Chocolatey means richer, deeper notes. Fruity means brighter, more complex flavors.)',
    options: [
      {
        value: 'chocolatey',
        label: 'Chocolatey & nutty',
        description: 'Rich, smooth, comforting',
      },
      { value: 'fruity', label: 'Fruity & bright', description: 'Lively, complex, vibrant' },
      { value: 'nutty', label: 'Nutty & caramel', description: 'Sweet, toasty, familiar' },
      {
        value: 'balanced',
        label: 'I like it all',
        description: "Something in the middle works for me",
      },
    ],
  },
  {
    id: 'coffeeContext',
    question: 'Do you usually make coffee at home or buy it at cafes?',
    description: "This helps us give you relevant tips and suggestions.",
    options: [
      { value: 'home', label: 'Mostly at home', description: "I brew my own coffee" },
      { value: 'cafe', label: 'Mostly at cafes', description: "I buy from coffee shops" },
      { value: 'both', label: 'Both equally', description: 'A mix of homemade and cafe' },
    ],
  },
];

// Equipment question (shown if home brewing)
const equipmentQuestion = {
  id: 'equipment',
  question: 'What coffee equipment do you have?',
  description:
    "Don't have anything? No worries! We can help with that too.",
  options: [
    { value: 'none', label: 'None yet', description: 'Looking to start' },
    { value: 'drip', label: 'Drip machine', description: 'Standard coffee maker' },
    { value: 'french-press', label: 'French press', description: 'Plunger style brewer' },
    { value: 'pour-over', label: 'Pour over', description: 'Chemex, V60, Kalita, etc.' },
    { value: 'aeropress', label: 'AeroPress', description: 'The versatile tube brewer' },
    { value: 'moka-pot', label: 'Moka pot', description: 'Stovetop espresso maker' },
    { value: 'espresso', label: 'Espresso machine', description: 'Real espresso at home' },
    { value: 'pods', label: 'Pod machine', description: 'Nespresso, Keurig, etc.' },
  ],
};

// Cafe suggestions question
const cafeQuestion = {
  id: 'wantsCafeSuggestions',
  question: 'Want us to find great cafes near you?',
  description: "We can suggest specialty coffee shops in your area.",
  options: [
    { value: 'yes', label: 'Yes, please!', description: "I'd love some recommendations" },
    { value: 'no', label: 'No thanks', description: "I'll skip the cafe suggestions" },
  ],
};

export default function QuizPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<QuizAnswers>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [locationInput, setLocationInput] = useState('');
  const [showLocationInput, setShowLocationInput] = useState(false);

  // Build dynamic question list based on answers
  const getQuestionList = useCallback(() => {
    const questionList = [...questions];

    // Add equipment question if they make coffee at home
    if (answers.coffeeContext === 'home' || answers.coffeeContext === 'both') {
      const contextIndex = questionList.findIndex((q) => q.id === 'coffeeContext');
      questionList.splice(contextIndex + 1, 0, equipmentQuestion);
    }

    // Add cafe question if they go to cafes
    if (answers.coffeeContext === 'cafe' || answers.coffeeContext === 'both') {
      questionList.push(cafeQuestion);
    }

    return questionList;
  }, [answers.coffeeContext]);

  const questionList = getQuestionList();
  const totalSteps = questionList.length;
  const progress = ((currentStep + 1) / totalSteps) * 100;
  const currentQuestion = questionList[currentStep];

  const handleAnswer = (value: string) => {
    const newAnswers = { ...answers, [currentQuestion.id]: value };
    setAnswers(newAnswers);

    // Handle cafe suggestion flow
    if (currentQuestion.id === 'wantsCafeSuggestions') {
      if (value === 'yes') {
        setShowLocationInput(true);
        return; // Don't advance, show location input
      }
    }

    // Move to next question or submit
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      submitQuiz(newAnswers);
    }
  };

  const handleLocationSubmit = () => {
    const newAnswers = {
      ...answers,
      wantsCafeSuggestions: true,
      location: { city: locationInput },
    };
    setAnswers(newAnswers);
    submitQuiz(newAnswers);
  };

  const handleUseCurrentLocation = async () => {
    if ('geolocation' in navigator) {
      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: false,
            timeout: 10000,
          });
        });

        const newAnswers = {
          ...answers,
          wantsCafeSuggestions: true,
          location: {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          },
        };
        setAnswers(newAnswers);
        submitQuiz(newAnswers);
      } catch {
        // Fall back to text input
        setShowLocationInput(true);
      }
    } else {
      setShowLocationInput(true);
    }
  };

  const submitQuiz = async (finalAnswers: Partial<QuizAnswers>) => {
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/quiz/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalAnswers),
      });

      if (!response.ok) {
        throw new Error('Failed to submit quiz');
      }

      const data = await response.json();
      router.push(`/results/${data.shareSlug}`);
    } catch (error) {
      console.error('Submit error:', error);
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    if (showLocationInput) {
      setShowLocationInput(false);
      return;
    }
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-cream-100">
      {/* Header */}
      <header className="w-full py-4 px-6 flex items-center gap-4">
        <Link href="/" className="text-coffee-600 hover:text-coffee-800">
          <ArrowLeft className="h-6 w-6" />
          <span className="sr-only">Back to home</span>
        </Link>
        <div className="flex items-center gap-2">
          <Coffee className="h-6 w-6 text-coffee-700" />
          <span className="font-semibold text-coffee-900">Coffee Suggester</span>
        </div>
      </header>

      {/* Progress bar */}
      <div className="px-6 py-2">
        <Progress value={progress} className="h-2" />
        <p className="text-xs text-coffee-500 mt-1">
          Question {currentStep + 1} of {totalSteps}
        </p>
      </div>

      {/* Quiz content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        <div className="w-full max-w-xl">
          {isSubmitting ? (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-coffee-100 rounded-full flex items-center justify-center mx-auto animate-pulse">
                <Coffee className="w-8 h-8 text-coffee-600" />
              </div>
              <p className="text-lg text-coffee-700">Brewing your recommendations...</p>
            </div>
          ) : showLocationInput ? (
            <div className="space-y-6 animate-fade-in">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-coffee-900 mb-2">
                  Where should we look for cafes?
                </h2>
                <p className="text-coffee-600">Enter your city or use your current location</p>
              </div>

              <div className="space-y-4">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full"
                  onClick={handleUseCurrentLocation}
                >
                  Use my current location
                </Button>

                <div className="flex items-center gap-4">
                  <div className="flex-1 h-px bg-coffee-200" />
                  <span className="text-sm text-coffee-500">or</span>
                  <div className="flex-1 h-px bg-coffee-200" />
                </div>

                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Enter your city (e.g., Seattle, WA)"
                    className="w-full px-4 py-3 rounded-lg border border-coffee-200 focus:outline-none focus:ring-2 focus:ring-coffee-400"
                    value={locationInput}
                    onChange={(e) => setLocationInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && locationInput && handleLocationSubmit()}
                  />
                  <Button
                    size="lg"
                    className="w-full"
                    onClick={handleLocationSubmit}
                    disabled={!locationInput}
                  >
                    Find cafes near me
                  </Button>
                </div>

                <Button variant="ghost" size="sm" className="w-full" onClick={() => submitQuiz(answers)}>
                  Skip cafe suggestions
                </Button>
              </div>
            </div>
          ) : (
            <QuizStep
              question={currentQuestion.question}
              description={currentQuestion.description}
              options={currentQuestion.options}
              selectedValue={answers[currentQuestion.id as keyof QuizAnswers] as string}
              onSelect={handleAnswer}
            />
          )}
        </div>
      </div>

      {/* Back button */}
      {currentStep > 0 && !isSubmitting && (
        <div className="px-6 py-4">
          <Button variant="ghost" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
      )}
    </div>
  );
}
