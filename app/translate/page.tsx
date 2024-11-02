import { auth } from '@clerk/nextjs/server';
import React from 'react';
import TranslationForm from '../components/TranslationForm';
import TranslationHistory from '../components/TranslationHistory';

export type TranslationLanguages = {
  translation: {
    [key: string]: {
      name: string;
      nativeName: string;
      dir: "ltr" | "rtl";
    };
  };
};

async function TranslatePage() {
  // Await the auth call
  const { userId } = await auth();

  // Ensure user is logged in
  if (!userId) {
    // You might want to redirect instead of throwing an error
    throw new Response("Unauthorized", { status: 401 });
  }

  // Fetch language endpoints
  const languageEndpoints = "https://api.cognitive.microsofttranslator.com/languages?api-version=3.0";

  try {
    // Await fetch and ensure revalidation of the response
    const response = await fetch(languageEndpoints, {
      next: {
        revalidate: 60 * 60 * 24, // Cache for 24 hours
      },
    });

    // Ensure response is valid before parsing
    if (!response.ok) {
      throw new Error(`Failed to fetch languages: ${response.statusText}`);
    }

    const languages = (await response.json()) as TranslationLanguages;

    return (
      <div className="px-10 xl:px-0 mb-20">
        <TranslationForm languages={languages} />
        <TranslationHistory />
      </div>
    );

  } catch (error) {
    // Handle any fetch errors
    console.error("Error fetching languages:", error);
    return <div>Error fetching languages: </div>;
  }
}

export default TranslatePage;
