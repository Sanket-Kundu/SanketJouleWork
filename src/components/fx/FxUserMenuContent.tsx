import React from "react";
import { Avatar } from "../avatar/Avatar";
import { Button } from "../button/Button";
import { Label } from "../label/Label";
import { List } from "../list/List";
import { ListItemCustom } from "../list/ListItemCustom";
import { Panel } from "../panel/Panel";
import { ButtonDesign } from "../../types/button";
import { AvatarSize, AvatarColorScheme } from "../../types/avatar";
import { TitleLevel } from "../../types/title";
import { ListSeparator } from "../../types/list";
import { AcceptIcon } from "../../icons/Accept";
import { EditIcon } from "../../icons/Edit";
import { SettingsIcon } from "../../icons/Settings";
import { PersonPlaceholderIcon } from "../../icons/PersonPlaceholder";
import { UserEditIcon } from "../../icons/UserEdit";
import type { FxUserMenuAccountData } from "../../types/fx-user-menu";
import { useTranslation } from "react-i18next";

interface FxUserMenuContentProps {
  ref?: React.Ref<HTMLDivElement>;
  selectedAccount: FxUserMenuAccountData | undefined;
  otherAccounts: FxUserMenuAccountData[];
  showManageAccount: boolean;
  showOtherAccounts: boolean;
  showEditAccounts: boolean;
  showEditButton: boolean;
  avatarInteractive?: boolean;
  children: React.ReactNode;
  titleRef?: React.RefObject<HTMLSpanElement | null>;
  onAvatarClick?: () => void;
  onManageAccountClick?: () => void;
  onEditAccountsClick?: () => void;
  onAccountSwitch: (account: FxUserMenuAccountData) => void;
}

export function FxUserMenuContent({
  selectedAccount,
  otherAccounts,
  showManageAccount,
  showOtherAccounts,
  showEditAccounts,
  showEditButton,
  avatarInteractive = true,
  children,
  titleRef,
  onAvatarClick,
  onManageAccountClick,
  onEditAccountsClick,
  onAccountSwitch,
  ref,
}: FxUserMenuContentProps) {
    const { t } = useTranslation("fx");
    return (
      <div ref={ref} className="px-2 pb-2">
      {/* Selected Account Header */}
      {selectedAccount && (
        <div
          className="flex flex-col items-center mb-2"
          aria-label={t("FX_CURRENT_ACCOUNT")}
        >
          <div className="relative mt-1 mb-2">
            <Avatar
              size={AvatarSize.L}
              image={selectedAccount.avatarSrc}
              initials={selectedAccount.avatarInitials}
              colorScheme={selectedAccount.avatarColorScheme || AvatarColorScheme.Accent6}
              icon={<PersonPlaceholderIcon className="h-6 w-6" />}
              interactive={avatarInteractive}
              onClick={avatarInteractive ? () => onAvatarClick?.() : undefined}
              accessibleName={selectedAccount.titleText}
              badge={
                showEditButton ? (
                  <span
                    className="flex items-center justify-center h-5 w-5 rounded-full"
                    style={{ backgroundColor: "var(--brand-background)", color: "var(--neutral-foreground-white)" }}
                  >
                    <EditIcon className="h-3 w-3" />
                  </span>
                ) : undefined
              }
            />
          </div>

          {selectedAccount.titleText && (
            <span
              ref={titleRef}
              className="text-center text-base font-semibold text-foreground mt-1"
            >
              {selectedAccount.titleText}
            </span>
          )}

          {selectedAccount.subtitleText && (
            <span className="text-center text-sm text-sapphire-text-tertiary mb-0.5">
              {selectedAccount.subtitleText}
            </span>
          )}

          {selectedAccount.description && (
            <span className="text-center text-sm text-sapphire-text-tertiary">
              {selectedAccount.description}
            </span>
          )}

          {selectedAccount.additionalInfo && (
            <span className="text-center text-sm text-sapphire-text-tertiary mt-1">
              {selectedAccount.additionalInfo}
            </span>
          )}

          {showManageAccount && (
            <Button
              design={ButtonDesign.Tertiary}
              icon={<SettingsIcon className="h-4 w-4" />}
              className="mt-3 font-semibold"
              onClick={() => onManageAccountClick?.()}
            >
              Manage Account
            </Button>
          )}
        </div>
      )}

      {/* Other Accounts Panel */}
      {showOtherAccounts && otherAccounts.length > 0 && (
        <Panel
          headerText={`Other Accounts (${otherAccounts.length})`}
          headerLevel={TitleLevel.H4}
          defaultCollapsed
          noPadding
          className="mb-2"
          header={
            <div className="flex flex-1 items-center justify-between min-w-0">
              <span className="text-sm font-semibold truncate">
                Other Accounts ({otherAccounts.length})
              </span>
              {showEditAccounts && (
                <Button
                  design={ButtonDesign.Tertiary}
                  icon={<UserEditIcon className="h-4 w-4" />}
                  iconOnly
                  accessibleName={t("FX_EDIT_ACCOUNTS")}
                  tooltip={t("FX_EDIT_ACCOUNTS")}
                  onClick={(detail) => {
                    detail.originalEvent.stopPropagation();
                    onEditAccountsClick?.();
                  }}
                  className="ml-2"
                />
              )}
            </div>
          }
        >
          <List
            accessibleName={`Other Accounts (${otherAccounts.length})`}
            separators={ListSeparator.All}
            onItemClick={({ item }) => {
              const accountId = item.getAttribute("data-item-key");
              const account = otherAccounts.find(a => a.id === accountId);
              if (account) {
                onAccountSwitch(account);
              }
            }}
          >
            {otherAccounts.map((account) => (
              <ListItemCustom
                key={account.id}
                itemKey={account.id}
                accessibleName={`${account.titleText} ${account.subtitleText || ""} ${account.description || ""}`}
              >
                <div className="flex items-center gap-3 w-full">
                  <Avatar
                    size={AvatarSize.S}
                    image={account.avatarSrc}
                    initials={account.avatarInitials}
                    colorScheme={account.avatarColorScheme || AvatarColorScheme.Accent6}
                    icon={<PersonPlaceholderIcon className="h-4 w-4" />}
                    accessibleName={account.titleText}
                  />
                  <div className="flex flex-col flex-1 min-w-0 gap-0.5">
                    {account.titleText && (
                      <span className="text-sm font-semibold text-foreground truncate">
                        {account.titleText}
                      </span>
                    )}
                    {account.subtitleText && (
                      <Label className="text-xs truncate">
                        {account.subtitleText}
                      </Label>
                    )}
                    {account.description && (
                      <Label className="text-xs truncate">
                        {account.description}
                      </Label>
                    )}
                  </div>
                  {account.selected && (
                    <AcceptIcon className="h-4 w-4 shrink-0 text-sapphire-text-tertiary" />
                  )}
                  {account.loading && (
                    <div className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-sapphire-text-tertiary border-t-transparent" />
                  )}
                </div>
              </ListItemCustom>
            ))}
          </List>
        </Panel>
      )}

      {/* Menu Items */}
      {React.Children.count(children) > 0 && (
        <List
          accessibleName={t("FX_ACTIONS")}
          separators={ListSeparator.None}
        >
          {children}
        </List>
      )}
    </div>
  );
}
