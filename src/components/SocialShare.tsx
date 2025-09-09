import { Button } from "@/components/ui/button";
import { Share2, Facebook, Twitter, MessageCircle, Link as LinkIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface SocialShareProps {
  title: string;
  description: string;
  url?: string;
  className?: string;
}

const SocialShare = ({ title, description, url, className = "" }: SocialShareProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const shareUrl = url || window.location.href;
  const shareText = `${title} - ${description}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Link copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy link");
    }
  };

  const shareOnWhatsApp = () => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${shareText}\n\n${shareUrl}`)}`;
    window.open(whatsappUrl, '_blank');
  };

  const shareOnFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(facebookUrl, '_blank');
  };

  const shareOnTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(twitterUrl, '_blank');
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url: shareUrl,
        });
      } catch (err) {
        setIsOpen(!isOpen);
      }
    } else {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <Button
        onClick={handleNativeShare}
        variant="outline"
        size="sm"
        className="gap-2"
      >
        <Share2 className="h-4 w-4" />
        Share
      </Button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full mt-2 right-0 bg-background border rounded-lg shadow-lg p-2 min-w-[200px] z-50">
            <div className="space-y-1">
              <Button
                onClick={shareOnWhatsApp}
                variant="ghost"
                size="sm"
                className="w-full justify-start gap-2 hover:bg-accent hover:text-accent-foreground"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </Button>
              
              <Button
                onClick={shareOnFacebook}
                variant="ghost"
                size="sm"
                className="w-full justify-start gap-2 hover:bg-accent hover:text-accent-foreground"
              >
                <Facebook className="h-4 w-4" />
                Facebook
              </Button>
              
              <Button
                onClick={shareOnTwitter}
                variant="ghost"
                size="sm"
                className="w-full justify-start gap-2 hover:bg-accent hover:text-accent-foreground"
              >
                <Twitter className="h-4 w-4" />
                Twitter
              </Button>
              
              <Button
                onClick={copyToClipboard}
                variant="ghost"
                size="sm"
                className="w-full justify-start gap-2"
              >
                <LinkIcon className="h-4 w-4" />
                Copy Link
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SocialShare;