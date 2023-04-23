import { Injector, common, components, types, webpack } from "replugged";
import { Channel, Guild } from "discord-types/general";
const { ContextMenuTypes } = types;
const {
  ContextMenu: { MenuItem },
} = components;
const {
  constants: { Permissions },
} = common;
const { waitForProps } = webpack;

const injector = new Injector();

type ThreadMod = {
  archiveThread: (threadId: string) => Promise<void>;
  lockThread: (threadId: string) => Promise<void>;
};

type CanMod = {
  can: (permission: BigInt, channel: Channel | Guild) => boolean;
  getChannelPermissions: (channel: Channel | Guild) => BigInt;
};

type ThreadMenuType = {
  channel: Channel;
};

export async function start() {
  const { archiveThread, lockThread } = await waitForProps<keyof ThreadMod, ThreadMod>(
    "archiveThread",
    "lockThread",
  );
  const { can } = await waitForProps<keyof CanMod, CanMod>("can", "getChannelPermissions");

  injector.utils.addMenuItem<ThreadMenuType>(ContextMenuTypes.ThreadContext, (data) => {
    const { channel } = data;
    const { archived, locked } = channel.threadMetadata;
    const canManage = can(Permissions.MANAGE_THREADS, channel);
    if (archived || locked || !canManage) {
      return undefined;
    }
    return (
      <MenuItem
        id="close-and-lock"
        label="Close and lock thread"
        action={async () => {
          await lockThread(channel.id);
          await archiveThread(channel.id);
        }}
      />
    );
  });
}

export function stop() {
  injector.uninjectAll();
}
