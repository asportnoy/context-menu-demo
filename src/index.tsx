import { Injector, Logger, components, types } from "replugged";
const { ContextMenuTypes } = types;
const {
  ContextMenu: { MenuItem },
} = components;

const injector = new Injector();
const logger = Logger.plugin("dev.asportnoy.ContextMenuDemo");

export function start() {
  injector.utils.addMenuItem(
    ContextMenuTypes.UserContext, // Right-clicking a user
    (data, menu) => {
      return (
        <MenuItem
          id="my-item"
          label="An Item!"
          action={() =>
            logger.log("User context menu item clicked!", {
              data,
              menu,
            })
          }
        />
      );
    },
  );
}
