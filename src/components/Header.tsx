import { Button } from "@/components/ui/button";
import { Leaf, Search, User, Heart, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import CurrencySelector from "@/components/CurrencySelector";
import { useI18n } from "@/contexts/I18nContext";
const logoImage = "/lovable-uploads/5692ae1d-154e-45fd-b4b0-99649fb40c3d.png";
// This component is deprecated, use HeaderMega instead
const Header = () => {
  return null;
};
export default Header;