import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import AnimationRevealPage from "helpers/AnimationRevealPage.js";



import LoginPage from "pages/Login.js";
import SignupPage from "pages/Signup.js";
import ListeArticles from "components/hero/ListeArticles.js";
import Panier from "components/hero/Panier.js";
import Commande from "components/hero/Commande.js";
import ListeFactures from "components/hero/ListeFactures.js";
import DetailsFacture from "components/hero/DetailsFacture.js";
import ListeCommandes from "components/hero/ListeCommandes.js";
import DetailsCommande from "components/hero/DetailsCommande.js";
import MainFooter from "components/footers/MainFooter";
import ChatWindow from "components/hero/ChatWindow.js";
import Chat from "components/hero/Chat.js";
import Avoirs from "components/hero/Avoirs";
import ArticlesAvoir from "components/hero/ArticlesAvoir.js";
import ComfirmAvoir from "components/hero/ConfirmAvoir.js";
import MotifAvoir from "components/hero/MotifAvoir.js";
import SavedAvoirs from "components/hero/SavedAvoirs.js";
import Loading from "components/hero/Loading.js";


import LandingPageFooter from "components/footers/LandingPageFooter.js";

export const components = {
  ArticlesAvoir: {
    name: "ArticlesAvoir",
    component: ArticlesAvoir,
    url: "/components/ArticlesAvoir",
  },
  LoginPage: {
    component: LoginPage,
    scrollAnimationDisabled: true,
    url: "/components/LoginPage",
  },
  SignupPage: {
    component: SignupPage,
    url: `/components/SignupPage`,
    scrollAnimationDisabled: true,
  },
  ListeArticles: {
    name: "ListeArticles",
    component: ListeArticles,
    url: "/components/ListeArticles",
  },
  Panier: {
    name: "Panier",
    component: Panier,
    url: "/components/Panier",
  },
  Commande: {
    name: "Commande",
    component: Commande,
    url: "/components/Commande",
  },
  ListeFactures: {
    name: "ListeFactures",
    component: ListeFactures,
    url: "/components/ListeFactures",
  },
  DetailsFacture: {
    name: "Details Facture",
    component: DetailsFacture,
    url: "/components/DetailsFacture",
  },
  ListeCommandes: {
    name: "Liste commandes",
    component: ListeCommandes,
    url: "/components/ListeCommande",
  },
  DetailsCommande: {
    name: "Details commandes",
    component: DetailsCommande,
    url: "/components/DetailsCommande",
  },
  ChatWindow: {
    name: "Chat Window",
    component: ChatWindow,
    url: "/components/ChatWindow",
  },
  Chat: {
    name: "Chat",
    component: Chat,
    url: "/components/Chat",
  },
  Avoirs: {
    name: "Avoirs",
    component: Avoirs,
    url: "/components/Avoirs",
  },
  ComfirmAvoir: {
    name: "ComfirmAvoir",
    component: ComfirmAvoir,
    url: "/components/ComfirmAvoir",
  },
  MotifAvoir: {
    name: "MotifAvoir",
    component: MotifAvoir,
    url: "/components/MotifAvoir",
  },
  LandingPageFooter: {
    name: "LandingPageFooter",
    component: LandingPageFooter,
    url: "/components/LandingPageFooter",
  },
  MainFooter: {
    name: "MainFooter",
    component: MainFooter,
    url: "/components/MainFooter",
  },
  SavedAvoirs: {
    name: "SavedAvoirs",
    component: SavedAvoirs,
    url: "/components/SavedAvoirs",
  },
};

export default () => {
  const { name } = useParams();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false); 
    }, 1500); 
  }, []);

  
  if (isLoading) {
    return <Loading />;
  }

  try {
    const Component = components[name].component;

    if (Component)
      return (
        <AnimationRevealPage>
          <Component />
        </AnimationRevealPage>
      );

    throw new Error("Component Not Found");
  } catch (e) {
    console.log(e);
    return <div>Error: Component Not Found</div>;
  }
};

