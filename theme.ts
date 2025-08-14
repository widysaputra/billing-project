import { definePreset } from "@primeuix/themes"
import Aura from "@primeuix/themes/aura"
import { palette } from "@primeuix/themes"

export const preset = definePreset(Aura, {
   semantic: {
      primary: palette('{emerald}')
   }
})
