import React from 'react'

type Props = React.SVGProps<SVGSVGElement> & { size?: number }

function Base({ size = 20, children, ...rest }: Props & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {children}
    </svg>
  )
}

export function IconBolt(props: Props) {
  return (
    <Base {...props}>
      <path d="M13 2 3 14h7l-1 8 10-12h-7l1-8Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </Base>
  )
}

export function IconShield(props: Props) {
  return (
    <Base {...props}>
      <path
        d="M12 2 20 6v7c0 5-3.4 8.7-8 9-4.6-.3-8-4-8-9V6l8-4Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path d="M9.5 12.5 11 14l3.5-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </Base>
  )
}

export function IconBeaker(props: Props) {
  return (
    <Base {...props}>
      <path
        d="M9 2v4l-4.5 8.2A6 6 0 0 0 10 22h4a6 6 0 0 0 5.5-7.8L15 6V2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path d="M8 6h8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M7.2 14h9.6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" opacity="0.8" />
    </Base>
  )
}

export function IconGithub(props: Props) {
  return (
    <Base {...props}>
      <path
        d="M9 19c-4 1.2-4-2-5-2m10 4v-3.2c0-.9.3-1.6.8-2-2.6-.3-5.3-1.3-5.3-5.7 0-1.2.4-2.2 1.2-3-.1-.3-.5-1.5.1-3 0 0 1-.3 3.2 1.2a11 11 0 0 1 5.8 0C17.9 3.6 19 4 19 4c.6 1.5.2 2.7.1 3 .7.8 1.2 1.8 1.2 3 0 4.4-2.7 5.4-5.3 5.7.5.4.8 1.2.8 2V21"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Base>
  )
}

export function IconChevronDown(props: Props) {
  return (
    <Base {...props}>
      <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </Base>
  )
}

export function IconClose(props: Props) {
  return (
    <Base {...props}>
      <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </Base>
  )
}

export function IconCheck(props: Props) {
  return (
    <Base {...props}>
      <path d="M20 6 9 17l-5-5" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
    </Base>
  )
}
