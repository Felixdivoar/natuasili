import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCurrency } from "@/contexts/CurrencyContext";
import { getReceipt /*, clearReceipt*/ } from "@/lib/receipt";
import { useI18n } from "@/i18n/I18nProvider";
import T from "@/i18n/T";

export default function ConfirmationPage() {
  const { slug } = useParams();
  const { formatPrice } = useCurrency();
  const { t } = useI18n();

  // Primary source of truth
  const r = getReceipt();

  // Optional: if you want to clear the receipt AFTER render, do it on unmount instead
  // useEffect(() => () => clearReceipt(), []);

  // Guard: if no receipt or wrong slug, show a friendly message (or redirect)
  if (!r || (slug && r.slug !== slug)) {
    return (
      <div className="max-w-3xl mx-auto my-12">
        <Card>
          <CardHeader><CardTitle><T k="confirm_booking_title" /></CardTitle></CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              <T k="confirm_booking_not_found" />
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { date, people, optionId, unitPrice, subtotal, partner, platform } = r;

  return (
    <div className="max-w-3xl mx-auto my-12">
      <Card>
        <CardHeader>
          <CardTitle><T k="confirm_booking_success" /></CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm"><span><T k="confirm_date" /></span><span>{date}</span></div>
            <div className="flex justify-between text-sm"><span><T k="confirm_participants" /></span><span>{people}</span></div>
            <div className="flex justify-between text-sm"><span><T k="confirm_option" /></span><span>{optionId === "premium" ? t("confirm_premium") : t("confirm_standard")}</span></div>
            <div className="flex justify-between text-sm"><span><T k="confirm_price_per_person" /></span><span>{formatPrice(unitPrice)}</span></div>
          </div>

          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span>{formatPrice(unitPrice)} × {people}</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span><T k="confirm_partner_initiatives" /></span>
              <span>{formatPrice(partner)}</span>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span><T k="confirm_platform_operations" /></span>
              <span>{formatPrice(platform)}</span>
            </div>
            <div className="flex justify-between font-semibold pt-2">
              <span><T k="confirm_total" /></span>
              <span>{formatPrice(subtotal)}</span>
            </div>
          </div>

          <div className="bg-success/10 border border-success p-4 rounded-md text-sm">
            🌍 {t("confirm_impact_message").replace("{amount}", formatPrice(partner))}
          </div>
          {/* What to expect */}
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold mb-2"><T k="confirm_what_to_expect" /></h3>
            <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
              <li><T k="confirm_expect_arrival" /></li>
              <li><T k="confirm_expect_activity" /></li>
              <li><T k="confirm_expect_safety" /></li>
              <li><T k="confirm_expect_support" /></li>
              <li><T k="confirm_expect_details" /></li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}