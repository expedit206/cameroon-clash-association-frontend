import { defineNuxtPlugin } from "#app";
import {
  BarChart3,
  User,
  LogOut,
  FileText,
  Key,
  Shield,
  Home,
  Swords,
  Castle,
  Folder,
  RefreshCw,
  Smartphone,
  CreditCard,
  Calendar,
  Megaphone,
  Pin,
  Trophy,
  Medal,
  Crown,
  Clock,
  BookOpen,
  AlertCircle,
  Check,
  X,
  Zap,
  CheckCircle,
  AlertTriangle,
  Info,
  MessageCircle,
  Globe,
  Scale,
  Radio,
  Search,
  Trash2,
  Users,
  ExternalLink,
} from "@lucide/vue";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component("LucideBarChart3", BarChart3);
  nuxtApp.vueApp.component("LucideUser", User);
  nuxtApp.vueApp.component("LucideLogOut", LogOut);
  nuxtApp.vueApp.component("LucideFileText", FileText);
  nuxtApp.vueApp.component("LucideKey", Key);
  nuxtApp.vueApp.component("LucideShield", Shield);
  nuxtApp.vueApp.component("LucideHome", Home);
  nuxtApp.vueApp.component("LucideSwords", Swords);
  nuxtApp.vueApp.component("LucideCastle", Castle);
  nuxtApp.vueApp.component("LucideFolder", Folder);
  nuxtApp.vueApp.component("LucideRefreshCw", RefreshCw);
  nuxtApp.vueApp.component("LucideSmartphone", Smartphone);
  nuxtApp.vueApp.component("LucideCreditCard", CreditCard);
  nuxtApp.vueApp.component("LucideCalendar", Calendar);
  nuxtApp.vueApp.component("LucideMegaphone", Megaphone);
  nuxtApp.vueApp.component("LucidePin", Pin);
  nuxtApp.vueApp.component("LucideTrophy", Trophy);
  nuxtApp.vueApp.component("LucideMedal", Medal);
  nuxtApp.vueApp.component("LucideCrown", Crown);
  nuxtApp.vueApp.component("LucideClock", Clock);
  nuxtApp.vueApp.component("LucideBookOpen", BookOpen);
  nuxtApp.vueApp.component("LucideAlertCircle", AlertCircle);
  nuxtApp.vueApp.component("LucideCheck", Check);
  nuxtApp.vueApp.component("LucideX", X);
  nuxtApp.vueApp.component("LucideZap", Zap);
  nuxtApp.vueApp.component("LucideCheckCircle", CheckCircle);
  nuxtApp.vueApp.component("LucideAlertTriangle", AlertTriangle);
  nuxtApp.vueApp.component("LucideInfo", Info);
  nuxtApp.vueApp.component("LucideMessageCircle", MessageCircle);
  nuxtApp.vueApp.component("LucideGlobe", Globe);
  nuxtApp.vueApp.component("LucideScale", Scale);
  nuxtApp.vueApp.component("LucideRadio", Radio);
  nuxtApp.vueApp.component("LucideSearch", Search);
  nuxtApp.vueApp.component("LucideTrash2", Trash2);
  nuxtApp.vueApp.component("LucideUsers", Users);
  nuxtApp.vueApp.component("LucideExternalLink", ExternalLink);
});
