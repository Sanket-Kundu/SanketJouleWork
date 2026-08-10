import { Button, Dialog, Link, JouleIcon } from "@sap-ui/fx-components";

interface AINoticeDialogProps {
  open: boolean;
  onClose: () => void;
}

/**
 * AI Notice Dialog - Displays AI usage disclaimer with gradient purple background
 * Uses the library Dialog component instead of native <dialog>.
 */
export function AINoticeDialog({ open, onClose }: AINoticeDialogProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose();
      }}
      enableBackdropClick
      hideBorders
      noPadding
      accessibleName="AI Notice"
      initialFocus="ai-notice-ok-button"
      className="!bg-transparent rounded-2xl overflow-hidden !shadow-none"
    >
      <div
        className="flex flex-col items-center text-center p-8 rounded-2xl min-h-[500px] min-w-[320px] max-w-[400px] justify-center"
        style={{
          background: "linear-gradient(180deg, #5d36ff 0%, #a855f7 100%)",
        }}
      >
        <JouleIcon size={80} className="mb-6" />

        <div className="text-2xl font-bold text-white mb-4">AI Notice</div>

        <div className="text-base leading-relaxed text-white/95 mb-6">
          Joule is powered by generative AI and all output should be reviewed
          before use. Please do not enter any sensitive personal data, and avoid
          entering any other personal data you do not wish to be processed.
          Learn more in the{" "}
          <Link
            href="https://help.sap.com/docs/joule/serviceguide/data-protection-and-privacy"
            target="_blank"
            className="!text-white !underline !decoration-solid [&_span[data-part=text]]:!no-underline"
          >
            Joule Data Protection and Privacy
          </Link>
          .
        </div>

        <Button
          id="ai-notice-ok-button"
          design="Secondary"
          onClick={onClose}
          className="min-w-[140px] !border-white/60 !text-white !bg-transparent hover:!bg-white/15 hover:!border-white"
        >
          OK
        </Button>
      </div>
    </Dialog>
  );
}
