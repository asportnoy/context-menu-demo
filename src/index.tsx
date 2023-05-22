import { Injector, components, types } from "replugged";
import { GetContextItem } from "replugged/dist/types";

const { MenuGroup, MenuItem } = components.ContextMenu;
const { ContextMenuTypes } = types;

const injector = new Injector();

export function start() {
  const getItem: GetContextItem = (data, menu) => {
    return (
      <MenuGroup>
        <MenuItem
          label="An item" // What shows to the user
          id="id"
          action={() => console.log(data, menu)} // What gets called when the item is clicked
        />
      </MenuGroup>
    );
  };

  // Registering the item
  // First arg is the navId of the menu
  // Second arg is the function  that gets called
  injector.utils.addMenuItem(ContextMenuTypes.UserContext, getItem);

  // If you don't want to use jsx, you can instead return an object
  // The attributes should correspond to the properties needed, except for `type`, which is the type of the item
  injector.utils.addMenuItem(
    ContextMenuTypes.Message,
    () => {
      const item = {
        id: "item",
        label: "Item",
        action: () => console.log(item),
        type: MenuItem,
      };
      return item;
    },
    2,
    -1,
  );

  // Registering an item also returns a function to remove the item if need be
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const callToRemove = injector.utils.addMenuItem(
    ContextMenuTypes.ChannelContext,
    (data, menu) => {
      // You can add children to make the pop-out menu, like the "Invite to Server" on a user menu
      return {
        type: MenuItem,
        label: "Hold on...",
        // id: "abcd",
        children: [
          {
            type: MenuItem,
            label: "Woah a submenu!",
            id: "1234",
            action: () => console.log(menu),
          },
        ],
      };

      // Same as the above, but with jsx
      // eslint-disable-next-line no-unreachable
      <MenuItem label="Hold on..." id="abcd">
        <MenuItem label="Woah a submenu!" id="1234" action={() => console.log(data)} />
      </MenuItem>;
    },
    1,
    1,
  );

  // Let's say you hate the copy-id button even existing, and want to remedy that
  injector.utils.addMenuItem<{ children: unknown }>(ContextMenuTypes.GuildContext, (data, menu) => {
    // Simply edit the menu, and it'll no longer appear
    console.log(menu);
    menu.children.pop();

    // We don't want to show an item, so we simply return nothing
    // Anything falsy can be returned in place of an item, and discord ignores it
  });
}

export function stop() {
  injector.uninjectAll(); // Would also remove any registered items
}
