module Deploy where

import Data.Semigroup ((<>))
import Options.Applicative

data Sample
  = Hello [String]
  | Goodbye
  deriving (Eq, Show)

newtype Deploy = ToSpaces String deriving (Eq, Show)

hello :: Parser Sample
hello = Hello <$> many (argument str (metavar "TARGET..."))

deploy :: Parser Deploy
deploy = ToSpaces <$> argument str (metavar "FILE...")

deployCommand :: Parser Deploy
deployCommand =
  subparser (command "deploy" (info deploy (progDesc "Deploy a given --file")) <> commandGroup "DevOps commands:" <> hidden)