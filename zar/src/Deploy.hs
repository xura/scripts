module Deploy where

import Options.Applicative
import Data.Semigroup ((<>))

data Sample
  = Hello [String]
  | Goodbye
  deriving (Eq, Show)

hello :: Parser Sample
hello = Hello <$> many (argument str (metavar "TARGET..."))

deployCommand :: Parser Deploy.Sample
deployCommand = subparser
                       ( command "bonjour"
                         (info hello
                               (progDesc "Print greeting"))
                      <> commandGroup "French commands:"
                      <> hidden
                      )