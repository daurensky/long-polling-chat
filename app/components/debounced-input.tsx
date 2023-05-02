import { ChangeEventHandler, ComponentProps, useCallback } from 'react'
import { debounce } from 'lodash'

export type Props = {
  debounceTime: number
  debouncedOnChange: ChangeEventHandler<HTMLInputElement>
} & ComponentProps<'input'>

const DebouncedInput = ({
  debounceTime,
  debouncedOnChange,
  onChange,
  ...props
}: Props) => {
  const handleDebounce = useCallback(
    debounce(debouncedOnChange, debounceTime),
    []
  )
  const handleChange: ChangeEventHandler<HTMLInputElement> = e => {
    onChange?.(e)
    handleDebounce(e)
  }

  return <input onChange={handleChange} {...props} />
}

export default DebouncedInput
